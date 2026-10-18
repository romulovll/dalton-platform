import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface RedactionResult {
  redactedPdf: Buffer;
  redactions: { tipo: string; original: string; masked: string }[];
}

// Patterns to redact (same as sensitive-scan but with replacement logic)
const REDACT_RULES: { tipo: string; regex: RegExp }[] = [
  { tipo: "CPF", regex: /\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[\/\-.\s]?\d{2}\b/g },
  { tipo: "RG", regex: /\b\d{2}[.\s]?\d{3}[.\s]?\d{3}[-.\s]?(?:\d{1}|[xX])\b/g },
  { tipo: "Telefone", regex: /\(?\b\d{2}\)?[\s.-]?9\d{4}[\s.-]?\d{4}\b/g },
  { tipo: "E-mail Pessoal", regex: /\b[a-zA-Z0-9._%+-]+@(?!institutodalton|gov\.br)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi },
  { tipo: "Conta Bancária", regex: /(?:ag[êe]ncia|conta)[:\s]*[\d.\-/]+/gi },
  { tipo: "PIX", regex: /(?:pix|chave)[:\s]*[\w@.\-]+/gi },
];

/**
 * Extract text from PDF, redact sensitive data, generate a new clean PDF.
 * Returns the redacted PDF buffer and a list of what was masked.
 */
export async function redactPdf(originalBuffer: Buffer): Promise<RedactionResult | null> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string; numpages: number }>;

  let parsed;
  try {
    parsed = await pdfParse(originalBuffer);
  } catch {
    return null; // Can't parse (scanned/image PDF)
  }

  let text = parsed.text;
  const redactions: { tipo: string; original: string; masked: string }[] = [];
  const seen = new Set<string>();

  // Apply redactions
  for (const rule of REDACT_RULES) {
    const regex = new RegExp(rule.regex.source, rule.regex.flags);
    text = text.replace(regex, (match) => {
      const key = `${rule.tipo}:${match}`;
      if (!seen.has(key)) {
        seen.add(key);
        const masked = match.length <= 4
          ? "***"
          : match.slice(0, 2) + "*".repeat(match.length - 4) + match.slice(-2);
        redactions.push({ tipo: rule.tipo, original: match, masked });
      }
      // Replace in text
      return "*".repeat(match.length);
    });
  }

  // If nothing was redacted, no need to generate new PDF
  if (redactions.length === 0) return null;

  // Generate a new clean PDF with the sanitized text
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 10;
  const lineHeight = 14;
  const margin = 50;
  const pageWidth = 595; // A4
  const pageHeight = 842;
  const maxWidth = pageWidth - margin * 2;

  // Split text into lines that fit the page
  const paragraphs = text.split("\n");
  const allLines: string[] = [];

  for (const para of paragraphs) {
    if (para.trim() === "") {
      allLines.push("");
      continue;
    }
    // Word wrap
    const words = para.split(/\s+/);
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth && currentLine) {
        allLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) allLines.push(currentLine);
  }

  // Render pages
  const linesPerPage = Math.floor((pageHeight - margin * 2 - 60) / lineHeight);
  let lineIndex = 0;

  while (lineIndex < allLines.length) {
    const page = doc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // Header on first page
    if (lineIndex === 0) {
      page.drawText("DOCUMENTO COM DADOS PESSOAIS REDIJIDOS", {
        x: margin,
        y,
        size: 8,
        font: boldFont,
        color: rgb(0.8, 0.1, 0.1),
      });
      y -= 12;
      page.drawText("Dados sensíveis substituídos por *** em conformidade com a LGPD (Lei 13.709/2018)", {
        x: margin,
        y,
        size: 7,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
      y -= 20;

      // Green line
      page.drawRectangle({
        x: margin,
        y: y + 8,
        width: maxWidth,
        height: 1.5,
        color: rgb(0.11, 0.37, 0.2),
      });
      y -= 10;
    }

    // Render lines
    for (let i = 0; i < linesPerPage && lineIndex < allLines.length; i++) {
      const line = allLines[lineIndex];
      if (line) {
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
      }
      y -= lineHeight;
      lineIndex++;
    }

    // Footer
    page.drawText("Gerado automaticamente — Instituto Dalton Salomão", {
      x: margin,
      y: 30,
      size: 6,
      font,
      color: rgb(0.7, 0.7, 0.7),
    });
  }

  const pdfBytes = await doc.save();
  return {
    redactedPdf: Buffer.from(pdfBytes),
    redactions,
  };
}
