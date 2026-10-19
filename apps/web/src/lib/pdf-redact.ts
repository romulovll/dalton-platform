import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface RedactionResult {
  redactedPdf: Buffer;
  redactions: { tipo: string; original: string; masked: string }[];
}

const REDACT_RULES: { tipo: string; regex: RegExp }[] = [
  { tipo: "CPF", regex: /\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[\/\-.\s]?\d{2}\b/g },
  { tipo: "RG", regex: /\b\d{2}[.\s]?\d{3}[.\s]?\d{3}[-.\s]?(?:\d{1}|[xX])\b/g },
  { tipo: "Telefone", regex: /\(?\b\d{2}\)?[\s.-]?9\d{4}[\s.-]?\d{4}\b/g },
  { tipo: "E-mail Pessoal", regex: /\b[a-zA-Z0-9._%+-]+@(?!institutodalton|gov\.br)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi },
  { tipo: "Conta Bancária", regex: /(?:ag[êe]ncia|conta)[:\s]*[\d.\-/]+/gi },
  { tipo: "PIX", regex: /(?:pix|chave)[:\s]*[\w@.\-]+/gi },
  { tipo: "Data Nascimento", regex: /\b\d{2}\/\d{2}\/\d{4}\b/g },
];

interface OcrWord {
  text: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  textStart: number;
  textEnd: number;
  pagePixelWidth: number;
  pagePixelHeight: number;
}

/**
 * Redact sensitive data in a PDF while preserving the original layout.
 * Uses Cloud Vision OCR to locate text, then overlays white boxes + *** on the original PDF.
 */
export async function redactPdf(originalBuffer: Buffer): Promise<RedactionResult | null> {
  const ocrResult = await ocrWithPositions(originalBuffer);
  if (!ocrResult || ocrResult.words.length === 0) return null;

  // Find sensitive data matches
  const redactions: { tipo: string; original: string; masked: string }[] = [];
  const wordIndicesToRedact = new Set<number>();
  const seen = new Set<string>();

  for (const rule of REDACT_RULES) {
    const regex = new RegExp(rule.regex.source, rule.regex.flags);
    let match;
    while ((match = regex.exec(ocrResult.fullText)) !== null) {
      const raw = match[0];
      const key = `${rule.tipo}:${raw}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const masked = raw.length <= 4
        ? "***"
        : raw.slice(0, 2) + "*".repeat(raw.length - 4) + raw.slice(-2);
      redactions.push({ tipo: rule.tipo, original: raw, masked });

      // Find overlapping OCR words
      const matchStart = match.index;
      const matchEnd = matchStart + raw.length;
      for (let i = 0; i < ocrResult.words.length; i++) {
        const w = ocrResult.words[i];
        if (w.textStart < matchEnd && w.textEnd > matchStart) {
          wordIndicesToRedact.add(i);
        }
      }
    }
  }

  if (redactions.length === 0) return null;

  // Load original PDF and overlay redactions
  const doc = await PDFDocument.load(originalBuffer);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  for (const idx of wordIndicesToRedact) {
    const word = ocrResult.words[idx];
    if (word.pageIndex >= pages.length) continue;

    const page = pages[word.pageIndex];
    const pdfW = page.getWidth();
    const pdfH = page.getHeight();

    // Scale OCR pixel coords to PDF points
    const scaleX = pdfW / word.pagePixelWidth;
    const scaleY = pdfH / word.pagePixelHeight;

    const x = word.x * scaleX;
    const y = word.y * scaleY;
    const w = word.width * scaleX;
    const h = word.height * scaleY;

    // PDF origin is bottom-left; OCR origin is top-left
    const pdfY = pdfH - y - h;

    // White rectangle to cover original text
    page.drawRectangle({
      x: x - 1,
      y: pdfY - 1,
      width: w + 2,
      height: h + 2,
      color: rgb(1, 1, 1),
    });

    // Draw *** in red over the covered area
    const starSize = Math.min(h * 0.65, 9);
    try {
      page.drawText("***", {
        x: x,
        y: pdfY + (h - starSize) / 2,
        size: starSize,
        font,
        color: rgb(0.7, 0.1, 0.1),
      });
    } catch {
      // encoding issue — skip
    }
  }

  // Redaction notice at bottom of first page
  if (pages.length > 0) {
    const p = pages[0];
    const pw = p.getWidth();
    try {
      p.drawRectangle({ x: 0, y: 0, width: pw, height: 16, color: rgb(0.95, 0.9, 0.9) });
      p.drawText(
        "DOCUMENTO REDIJIDO - Dados pessoais mascarados conforme LGPD (Lei 13.709/2018)",
        { x: 8, y: 4, size: 6.5, font, color: rgb(0.6, 0.1, 0.1) }
      );
    } catch { /* skip */ }
  }

  const pdfBytes = await doc.save();
  console.log(`[REDACT] Redacted ${wordIndicesToRedact.size} words, ${redactions.length} patterns`);
  return { redactedPdf: Buffer.from(pdfBytes), redactions };
}

interface OcrResultWithPositions {
  fullText: string;
  words: OcrWord[];
}

async function ocrWithPositions(buffer: Buffer): Promise<OcrResultWithPositions | null> {
  try {
    const { ImageAnnotatorClient } = await import("@google-cloud/vision");
    const client = new ImageAnnotatorClient();
    const content = buffer.toString("base64");

    const allWords: OcrWord[] = [];
    let fullText = "";

    for (let startPage = 1; startPage <= 50; startPage += 5) {
      const pageNums = Array.from({ length: 5 }, (_, i) => startPage + i);

      try {
        const [result] = await client.batchAnnotateFiles({
          requests: [{
            inputConfig: { mimeType: "application/pdf", content },
            features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
            pages: pageNums,
          }],
        });

        const responses = result.responses?.[0]?.responses || [];
        if (responses.length === 0) break;

        for (let ri = 0; ri < responses.length; ri++) {
          const pageIndex = startPage - 1 + ri;
          const annotation = responses[ri].fullTextAnnotation;
          if (!annotation) continue;

          for (const p of annotation.pages || []) {
            const pagePixelWidth = p.width || 1;
            const pagePixelHeight = p.height || 1;

            for (const block of p.blocks || []) {
              for (const para of block.paragraphs || []) {
                for (const word of para.words || []) {
                  const wordText = (word.symbols || []).map(s => s.text || "").join("");
                  const vertices = word.boundingBox?.vertices || [];

                  if (vertices.length >= 4 && wordText) {
                    const xs = vertices.map(v => v.x || 0);
                    const ys = vertices.map(v => v.y || 0);

                    const textStart = fullText.length;
                    fullText += wordText + " ";
                    const textEnd = fullText.length - 1;

                    allWords.push({
                      text: wordText,
                      pageIndex,
                      x: Math.min(...xs),
                      y: Math.min(...ys),
                      width: Math.max(...xs) - Math.min(...xs),
                      height: Math.max(...ys) - Math.min(...ys),
                      textStart,
                      textEnd,
                      pagePixelWidth,
                      pagePixelHeight,
                    });
                  }
                }
              }
            }
          }

          fullText += "\n";
        }

        if (responses.length < 5) break;
      } catch { break; }
    }

    if (allWords.length === 0) return null;
    console.log(`[OCR] Extracted ${allWords.length} words, ${fullText.length} chars`);
    return { fullText, words: allWords };
  } catch (err) {
    console.error("[OCR] Failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

export type { RedactionResult };
