import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { escapeHtml } from "@/lib/sanitize";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids");
  if (!ids) {
    return NextResponse.json({ error: "ids parameter required" }, { status: 400 });
  }

  const bemIds = ids.split(",");
  const bens = await prisma.bem.findMany({
    where: { id: { in: bemIds } },
    include: { unidadeAtual: true, categoria: true },
    orderBy: { tombamento: "asc" },
  });

  if (bens.length === 0) {
    return NextResponse.json({ error: "No assets found" }, { status: 404 });
  }

  // Generate HTML page with printable labels
  const labels = await Promise.all(
    bens.map(async (bem) => {
      const qrDataUrl = await QRCode.toDataURL(bem.tombamento, {
        width: 120,
        margin: 1,
        color: { dark: "#1B5E34" },
      });

      return `
        <div class="label">
          <div class="label-header">Instituto Dalton Salomão</div>
          <div class="label-body">
            <img src="${qrDataUrl}" alt="QR ${escapeHtml(bem.tombamento)}" />
            <div class="label-info">
              <div class="tombamento">${escapeHtml(bem.tombamento)}</div>
              <div class="descricao">${escapeHtml(bem.descricao)}</div>
              <div class="detalhe">${escapeHtml(bem.categoria.nome)}</div>
              <div class="detalhe">${escapeHtml(bem.unidadeAtual.nome)}</div>
            </div>
          </div>
        </div>
      `;
    })
  );

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Etiquetas Patrimoniais — IDS</title>
  <style>
    @page { size: A4; margin: 10mm; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 10mm; }
    .labels-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8mm;
    }
    .label {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 6px;
      page-break-inside: avoid;
    }
    .label-header {
      text-align: center;
      font-size: 7pt;
      font-weight: bold;
      color: #1B5E34;
      border-bottom: 1px solid #8BC34A;
      padding-bottom: 3px;
      margin-bottom: 4px;
    }
    .label-body {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .label-body img { width: 60px; height: 60px; }
    .label-info { flex: 1; min-width: 0; }
    .tombamento {
      font-family: monospace;
      font-size: 10pt;
      font-weight: bold;
      color: #1B5E34;
    }
    .descricao {
      font-size: 7pt;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .detalhe { font-size: 6pt; color: #999; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom:15px;text-align:center">
    <button onclick="window.print()" style="padding:8px 24px;background:#1B5E34;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px">
      Imprimir Etiquetas
    </button>
    <span style="margin-left:10px;color:#999;font-size:12px">${bens.length} etiqueta(s)</span>
  </div>
  <div class="labels-grid">
    ${labels.join("")}
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
