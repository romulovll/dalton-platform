import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { scanPdfBuffer } from "./sensitive-scan";
import type { SensitiveMatch } from "./sensitive-scan";

interface RedactionResult {
  redactedPdf: Buffer;
  redactions: { tipo: string; original: string; masked: string }[];
}

// Patterns to redact
const REDACT_RULES: { tipo: string; regex: RegExp }[] = [
  { tipo: "CPF", regex: /\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[\/\-.\s]?\d{2}\b/g },
  { tipo: "RG", regex: /\b\d{2}[.\s]?\d{3}[.\s]?\d{3}[-.\s]?(?:\d{1}|[xX])\b/g },
  { tipo: "Telefone", regex: /\(?\b\d{2}\)?[\s.-]?9\d{4}[\s.-]?\d{4}\b/g },
  { tipo: "E-mail Pessoal", regex: /\b[a-zA-Z0-9._%+-]+@(?!institutodalton|gov\.br)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi },
  { tipo: "Conta Bancária", regex: /(?:ag[êe]ncia|conta)[:\s]*[\d.\-/]+/gi },
  { tipo: "PIX", regex: /(?:pix|chave)[:\s]*[\w@.\-]+/gi },
  { tipo: "Data Nascimento", regex: /(?:data\s*nasc[:\s.]*|nascimento[:\s]*)(\d{2}\/\d{2}\/\d{4})/gi },
];

/**
 * Extract text (via pdf-parse or Cloud Vision OCR), redact sensitive data,
 * generate a new clean PDF. Returns the redacted PDF buffer and what was masked.
 */
export async function redactPdf(originalBuffer: Buffer): Promise<RedactionResult | null> {
  // Use the shared scanner which handles both text and scanned PDFs
  const matches = await scanPdfBuffer(originalBuffer);

  // Filter out warnings (non-sensitive findings)
  const sensitiveMatches = matches.filter((m) => m.tipo !== "Aviso");
  if (sensitiveMatches.length === 0) return null;

  // Now extract the full text for redaction (same path as scanner)
  let text = await extractTextForRedaction(originalBuffer);
  if (!text) return null;

  const redactions: { tipo: string; original: string; masked: string }[] = [];
  const seen = new Set<string>();

  // Apply redactions to text
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
      return "*".repeat(match.length);
    });
  }

  if (redactions.length === 0) return null;

  // Generate a new clean PDF with the sanitized text
  const redactedPdf = await generateRedactedPdf(text);

  return { redactedPdf, redactions };
}

async function extractTextForRedaction(buffer: Buffer): Promise<string | null> {
  // Try pdf-parse first
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
      } catch { /* skip */ }
    }
    parser.destroy();
    if (text.trim().length > 50) return text;
  } catch { /* fallback to OCR */ }

  // Cloud Vision OCR
  try {
    const { ImageAnnotatorClient } = await import("@google-cloud/vision");
    const client = new ImageAnnotatorClient();
    const [result] = await client.documentTextDetection({
      image: { content: buffer.toString("base64") },
      imageContext: { languageHints: ["pt"] },
    });
    return result.fullTextAnnotation?.text || null;
  } catch {
    return null;
  }
}

async function generateRedactedPdf(text: string): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 10;
  const lineHeight = 14;
  const margin = 50;
  const pageWidth = 595; // A4
  const pageHeight = 842;
  const maxWidth = pageWidth - margin * 2;

  // Word-wrap text into lines
  const paragraphs = text.split("\n");
  const allLines: string[] = [];

  for (const para of paragraphs) {
    if (para.trim() === "") {
      allLines.push("");
      continue;
    }
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
        x: margin, y, size: 8, font: boldFont,
        color: rgb(0.8, 0.1, 0.1),
      });
      y -= 12;
      page.drawText("Dados sensíveis substituídos por *** em conformidade com a LGPD (Lei 13.709/2018)", {
        x: margin, y, size: 7, font,
        color: rgb(0.5, 0.5, 0.5),
      });
      y -= 20;
      page.drawRectangle({
        x: margin, y: y + 8, width: maxWidth, height: 1.5,
        color: rgb(0.11, 0.37, 0.2),
      });
      y -= 10;
    }

    for (let i = 0; i < linesPerPage && lineIndex < allLines.length; i++) {
      const line = allLines[lineIndex];
      if (line) {
        // Replace problematic characters that pdf-lib can't encode
        const safeLine = line.replace(/[^\x20-\x7E\xA0-\xFF]/g, " ");
        try {
          page.drawText(safeLine, {
            x: margin, y, size: fontSize, font,
            color: rgb(0.2, 0.2, 0.2),
          });
        } catch {
          // Skip lines with encoding issues
        }
      }
      y -= lineHeight;
      lineIndex++;
    }

    page.drawText("Gerado automaticamente — Instituto Dalton Salomão", {
      x: margin, y: 30, size: 6, font,
      color: rgb(0.7, 0.7, 0.7),
    });
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

export type { SensitiveMatch };
