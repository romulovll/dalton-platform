/**
 * Scan text for sensitive personal data (LGPD compliance).
 * Returns a list of findings with type and masked value.
 */

interface SensitiveMatch {
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
    tipo: "CNPJ",
    // Don't flag CNPJ — it's public information for institutions
    regex: /(?!)/g, // never matches
    mask: (m) => m,
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

export async function scanPdfBuffer(buffer: Buffer): Promise<SensitiveMatch[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;
    const data = await pdfParse(buffer);
    return scanForSensitiveData(data.text);
  } catch {
    // If PDF can't be parsed (scanned/image), return a warning
    return [{
      tipo: "Aviso",
      valor: "PDF não pôde ser lido",
      contexto: "O documento pode ser uma imagem escaneada. Verifique manualmente se contém dados pessoais.",
    }];
  }
}
