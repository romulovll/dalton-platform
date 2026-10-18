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
    regex: /\b(\d{3})[.\s]?(\d{3})[.\s]?(\d{3})[\/\-.\s]?(\d{2})\b/g,
    mask: (m) => m.replace(/\d(?=.{4})/g, "*"),
  },
  {
    tipo: "RG",
    regex: /\b(\d{2})[.\s]?(\d{3})[.\s]?(\d{3})[-.\s]?(\d{1}|[xX])\b/g,
    mask: (m) => m.replace(/\d(?=.{3})/g, "*"),
  },
  {
    tipo: "Telefone Pessoal",
    regex: /\(?\b(\d{2})\)?[\s.-]?(9\d{4})[\s.-]?(\d{4})\b/g,
    mask: (m) => m.replace(/\d(?=.{4})/g, "*"),
  },
  {
    tipo: "E-mail Pessoal",
    regex: /\b[a-zA-Z0-9._%+-]+@(?!institutodalton|gov\.br)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi,
    mask: (m) => {
      const [user, domain] = m.split("@");
      return `${user[0]}***@${domain}`;
    },
  },
  {
    tipo: "Conta Bancária",
    regex: /\b(?:ag[êe]ncia|conta)[:\s]*[\d.\-/]+\b/gi,
    mask: (m) => m.replace(/\d/g, "*"),
  },
  {
    tipo: "PIX (possível chave)",
    regex: /\b(?:pix|chave)[:\s]*[\w@.\-]+\b/gi,
    mask: (m) => m.slice(0, 8) + "***",
  },
  {
    tipo: "Data de Nascimento",
    regex: /(?:data\s*nasc[:\s.]*|nascimento[:\s]*)(\d{2}\/\d{2}\/\d{4})/gi,
    mask: (m) => m.replace(/\d{2}\/\d{2}\/\d{4}/, "**/**/****"),
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

    const [result] = await client.documentTextDetection({
      image: { content: buffer.toString("base64") },
      imageContext: { languageHints: ["pt"] },
    });

    const text = result.fullTextAnnotation?.text || "";
    if (text.trim().length > 0) {
      console.log(`[OCR] Cloud Vision extracted ${text.length} chars from scanned PDF`);
      return text;
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
