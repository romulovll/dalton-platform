/**
 * Scan text for sensitive personal data (LGPD compliance).
 * Supports text-based PDFs (pdf-parse) and scanned/image PDFs (Google Cloud Vision OCR).
 */

export interface SensitiveMatch {
  tipo: string;
  valor: string; // masked
  contexto: string;
}

const patterns: { tipo: string; regex: RegExp; mask: (m: string) => string }[] = [
  {
    tipo: "CPF",
    regex: /\d{3}[.\s]?\d{3}[.\s]?\d{3}[\/\-.\s]?\d{2}/g,
    mask: (m) => m.replace(/\d(?=.{4})/g, "*"),
  },
  {
    tipo: "RG",
    regex: /\d{2}[.\s]?\d{3}[.\s]?\d{3}[-.\s]?\d{1,2}[-.\s]?(?:SSP)?[\/\s]?(?:SP)?/gi,
    mask: (m) => m.replace(/\d(?=.{3})/g, "*"),
  },
  {
    tipo: "Telefone",
    regex: /\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{3,4}/g,
    mask: (m) => m.replace(/\d(?=.{4})/g, "*"),
  },
  {
    tipo: "E-mail",
    regex: /[a-zA-Z0-9._%+-]+@(?!institutodalton|gov\.br)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    mask: (m) => {
      const [user, domain] = m.split("@");
      return `${user[0]}***@${domain}`;
    },
  },
  {
    tipo: "Conta",
    regex: /(?:ag[êe]ncia|conta)[:\s]*[\d.\-/]+/gi,
    mask: (m) => m.replace(/\d/g, "*"),
  },
  {
    tipo: "PIX",
    regex: /(?:pix|chave)[:\s]*[\w@.\-]+/gi,
    mask: (m) => m.slice(0, 8) + "***",
  },
  {
    tipo: "Data",
    regex: /\d{2}\/\d{2}\/\d{4}/g,
    mask: () => "**/**/****",
  },
  {
    tipo: "Endereço",
    regex: /(?:Rua|Av\.|Avenida|Alameda|Travessa|Pra[cç]a)[:\s]+[^\n]{5,80}/gi,
    mask: () => "Rua: ***",
  },
  {
    tipo: "CEP",
    regex: /\d{5}[-.\s]?\d{3}/g,
    mask: (m) => m.replace(/\d/g, "*"),
  },
  {
    tipo: "CPF Label",
    regex: /CPF[:\s]*\S+/gi,
    mask: () => "CPF: ***",
  },
  {
    tipo: "RG Label",
    regex: /RG[:\s]*\S+/gi,
    mask: () => "RG: ***",
  },
  {
    tipo: "Data Nasc",
    regex: /Data\s*Nasc[:\s.]*\S+/gi,
    mask: () => "Data Nasc: ***",
  },
  {
    tipo: "Conta Bancária",
    regex: /\d{3}\.\d{3}\.\d{3}\.\d{3}\.\d{3}/g,
    mask: (m) => m.replace(/\d/g, "*"),
  },
  {
    tipo: "Nome em Extrato",
    regex: /\d{2}\/\d{2}\s+\d{2}:\d{2}\s+[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]{5,}/g,
    mask: () => "***",
  },
  {
    tipo: "Nome Pessoal",
    regex: /\b[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]{2,}(?:\s+(?:DE|DA|DO|DOS|DAS|E)\s+|\s+)[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]{2,}(?:(?:\s+(?:DE|DA|DO|DOS|DAS|E)\s+|\s+)[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]{2,})+/g,
    mask: () => "***",
  },
  {
    tipo: "ID Transação",
    regex: /\b[A-Z]{2}\d{6,}\b/g,
    mask: (m) => m.replace(/\d/g, "*"),
  },
];

function getContext(text: string, index: number, length: number): string {
  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + length + 30);
  let ctx = text.slice(start, end).replace(/\n/g, " ").trim();
  if (start > 0) ctx = "..." + ctx;
  if (end < text.length) ctx = ctx + "...";
  return ctx;
}

export function scanForSensitiveData(text: string): SensitiveMatch[] {
  const matches: SensitiveMatch[] = [];
  const seen = new Set<string>();

  for (const pattern of patterns) {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    while ((match = regex.exec(text)) !== null) {
      const raw = match[0];
      const key = `${pattern.tipo}:${raw}`;
      if (seen.has(key)) continue;
      seen.add(key);

      matches.push({
        tipo: pattern.tipo,
        valor: pattern.mask(raw),
        contexto: getContext(text, match.index, raw.length),
      });
    }
  }

  return matches;
}

/**
 * Extract text from PDF using pdf-parse (text PDFs) or Cloud Vision OCR (scanned PDFs).
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  // Try text extraction first (fast, free)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PDFParse } = require("pdf-parse");
    const parser = new PDFParse(new Uint8Array(buffer));
    await parser.load();
    const info = await parser.getInfo();
    const pages = info.pages || info.numPages || 0;
    let text = "";
    for (let i = 1; i <= pages; i++) {
      try {
        const pageText = await parser.getPageText(i);
        if (pageText) text += pageText + "\n";
      } catch { /* skip unreadable pages */ }
    }
    parser.destroy();
    if (text.trim().length > 50) return text; // Got meaningful text
  } catch { /* pdf-parse failed, try OCR */ }

  // Fall back to Google Cloud Vision OCR (handles scanned/image PDFs)
  try {
    const { ImageAnnotatorClient } = await import("@google-cloud/vision");
    const client = new ImageAnnotatorClient();
    const content = buffer.toString("base64");
    let allText = "";

    // Cloud Vision limits to 5 pages per call — batch in chunks
    for (let startPage = 1; startPage <= 50; startPage += 5) {
      const pages = Array.from({ length: 5 }, (_, i) => startPage + i);

      try {
        const [result] = await client.batchAnnotateFiles({
          requests: [
            {
              inputConfig: { mimeType: "application/pdf", content },
              features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
              pages,
            },
          ],
        });

        const responses = result.responses?.[0]?.responses || [];
        if (responses.length === 0) break; // no more pages

        for (const r of responses) {
          allText += (r.fullTextAnnotation?.text || "") + "\n";
        }

        if (responses.length < 5) break; // last batch
      } catch {
        break; // page range exceeded total pages
      }
    }

    if (allText.trim().length > 0) {
      console.log(`[OCR] Cloud Vision extracted ${allText.length} chars`);
      return allText;
    }
  } catch (err) {
    console.error("[OCR] Cloud Vision failed:", err instanceof Error ? err.message : err);
  }

  return "";
}

export async function scanPdfBuffer(buffer: Buffer): Promise<SensitiveMatch[]> {
  const text = await extractPdfText(buffer);

  if (text.length === 0) {
    return [{
      tipo: "Aviso",
      valor: "PDF não pôde ser lido",
      contexto: "Não foi possível extrair texto do documento. Verifique manualmente se contém dados pessoais.",
    }];
  }

  const matches = scanForSensitiveData(text);

  if (matches.length === 0) {
    return []; // Clean document
  }

  return matches;
}
