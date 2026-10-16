import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDepreciacaoReport } from "@/lib/actions/depreciation";
import { getNotasExplicativas } from "@/lib/actions/notas-explicativas";
import { escapeHtml } from "@/lib/sanitize";

export async function GET() {
  const [report, notas, org] = await Promise.all([
    getDepreciacaoReport(),
    getNotasExplicativas(),
    prisma.organizacao.findFirst(),
  ]);

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const h = escapeHtml; // shorthand

  const today = new Date().toLocaleDateString("pt-BR");

  const origemLabel: Record<string, string> = {
    PROPRIO: "Recursos Próprios",
    PARCERIA_PUBLICA: "Parceria Pública",
    DOACAO: "Doação",
  };

  const formaLabel: Record<string, string> = {
    COMPRA: "Compra",
    DOACAO: "Doação",
    CESSAO: "Cessão",
    COMODATO: "Comodato",
    TRANSFERENCIA: "Transferência",
  };

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Relatório Patrimonial — ${org?.nome || "Instituto Dalton Salomão"}</title>
  <style>
    @page { size: A4 landscape; margin: 15mm; }
    body { font-family: Arial, sans-serif; font-size: 9pt; color: #333; margin: 0; padding: 15mm; }
    h1 { color: #1B5E34; font-size: 16pt; margin-bottom: 4px; }
    h2 { color: #1B5E34; font-size: 12pt; border-bottom: 2px solid #8BC34A; padding-bottom: 3px; margin-top: 20px; }
    h3 { font-size: 10pt; margin-top: 14px; color: #555; }
    .subtitle { color: #666; font-size: 10pt; margin-bottom: 15px; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 10px 0; }
    .summary-card { border: 1px solid #ddd; border-radius: 4px; padding: 8px; text-align: center; }
    .summary-card .label { font-size: 8pt; color: #888; }
    .summary-card .value { font-size: 14pt; font-weight: bold; color: #1B5E34; }
    .summary-card .value.red { color: #D32F2F; }
    .summary-card .value.green { color: #1B5E34; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 8pt; }
    th { background: #f5f5f5; border: 1px solid #ddd; padding: 4px 6px; text-align: left; font-weight: bold; }
    td { border: 1px solid #ddd; padding: 3px 6px; }
    .right { text-align: right; }
    .mono { font-family: monospace; }
    .center { text-align: center; }
    .footer { margin-top: 20px; border-top: 1px solid #ccc; padding-top: 8px; font-size: 7pt; color: #999; }
    .no-print { margin-bottom: 15px; text-align: center; }
    @media print { .no-print { display: none; } }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <div class="no-print">
    <button onclick="window.print()" style="padding:10px 30px;background:#1B5E34;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px">
      Imprimir / Salvar PDF
    </button>
  </div>

  <h1>${org?.nome || "Instituto Dalton Salomão"}</h1>
  <p class="subtitle">Relatório Patrimonial e Notas Explicativas — ${today}</p>
  ${org?.cnpj ? `<p style="font-size:8pt;color:#666">CNPJ: ${org.cnpj}</p>` : ""}

  <!-- Summary -->
  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Total de Bens Ativos</div>
      <div class="value">${notas.resumo.bensAtivos}</div>
    </div>
    <div class="summary-card">
      <div class="label">Valor Total de Aquisição</div>
      <div class="value">R$ ${fmt(notas.resumo.totalAquisicao)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Depreciação Acumulada</div>
      <div class="value red">R$ ${fmt(notas.resumo.totalDepreciacao)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Valor Contábil Líquido</div>
      <div class="value green">R$ ${fmt(notas.resumo.valorContabil)}</div>
    </div>
  </div>

  <!-- Depreciation table -->
  <h2>Demonstrativo de Depreciação</h2>
  <table>
    <thead>
      <tr>
        <th>Tombamento</th>
        <th>Descrição</th>
        <th>Categoria</th>
        <th>Unidade</th>
        <th class="right">Valor Aquisição</th>
        <th class="right">Depreciação</th>
        <th class="right">Valor Contábil</th>
        <th class="center">%</th>
      </tr>
    </thead>
    <tbody>
      ${report.map((r) => `
        <tr>
          <td class="mono">${h(r.tombamento)}</td>
          <td>${h(r.descricao)}</td>
          <td>${h(r.categoria)}</td>
          <td>${h(r.unidade)}</td>
          <td class="right mono">${fmt(r.valorAquisicao)}</td>
          <td class="right mono" style="color:#D32F2F">${fmt(r.depreciacaoAcumulada)}</td>
          <td class="right mono" style="font-weight:bold">${fmt(r.valorContabil)}</td>
          <td class="center">${r.percentualDepreciado.toFixed(0)}%</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <!-- Notas Explicativas -->
  <div class="page-break"></div>
  <h2>Notas Explicativas (ITG 2002 R1)</h2>

  <h3>1. Resumo do Patrimônio</h3>
  <div class="summary-grid">
    <div class="summary-card"><div class="label">Bens Ativos</div><div class="value">${notas.resumo.bensAtivos}</div></div>
    <div class="summary-card"><div class="label">Bens Baixados</div><div class="value">${notas.resumo.baixados}</div></div>
    <div class="summary-card"><div class="label">Inalienáveis</div><div class="value">${notas.resumo.inalienaveisCount}</div></div>
    <div class="summary-card"><div class="label">Remanescentes</div><div class="value">${notas.resumo.remanescentesCount}</div></div>
  </div>

  <h3>2. Composição por Categoria e Critérios de Depreciação</h3>
  <table>
    <thead>
      <tr><th>Categoria</th><th class="center">Qtde</th><th class="center">Vida Útil</th><th class="center">Taxa Anual</th><th class="right">Valor Aquisição</th><th class="right">Depreciação Acum.</th><th class="right">Valor Contábil</th></tr>
    </thead>
    <tbody>
      ${notas.porCategoria.map((c) => `
        <tr>
          <td>${h(c.categoria)}</td>
          <td class="center">${c.quantidade}</td>
          <td class="center">${c.vidaUtilAnos} anos</td>
          <td class="center">${c.taxaAnual.toFixed(0)}%</td>
          <td class="right mono">${fmt(c.valorAquisicao)}</td>
          <td class="right mono" style="color:#D32F2F">${fmt(c.depreciacaoAcumulada)}</td>
          <td class="right mono" style="font-weight:bold">${fmt(c.valorAquisicao - c.depreciacaoAcumulada)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <h3>3. Origem dos Recursos</h3>
  <table>
    <thead><tr><th>Origem</th><th class="center">Qtde</th><th class="right">Valor Total</th></tr></thead>
    <tbody>
      ${notas.porOrigem.map((o) => `
        <tr><td>${origemLabel[o.origem] || o.origem}</td><td class="center">${o.quantidade}</td><td class="right mono">${fmt(o.valor)}</td></tr>
      `).join("")}
    </tbody>
  </table>

  <h3>4. Forma de Aquisição</h3>
  <table>
    <thead><tr><th>Forma</th><th class="center">Qtde</th><th class="right">Valor Total</th></tr></thead>
    <tbody>
      ${notas.porFormaAquisicao.map((f) => `
        <tr><td>${formaLabel[f.forma] || f.forma}</td><td class="center">${f.quantidade}</td><td class="right mono">${fmt(f.valor)}</td></tr>
      `).join("")}
    </tbody>
  </table>

  ${notas.parcerias.length > 0 ? `
  <h3>5. Parcerias Vigentes (Lei 13.019/2014)</h3>
  <table>
    <thead><tr><th>Número</th><th>Tipo</th><th>Órgão</th><th class="center">Bens Vinculados</th></tr></thead>
    <tbody>
      ${notas.parcerias.map((p) => `
        <tr><td class="mono">${h(p.numero)}</td><td>${h(p.tipo)}</td><td>${h(p.orgao)}</td><td class="center">${p.bensVinculados}</td></tr>
      `).join("")}
    </tbody>
  </table>
  ` : ""}

  <div class="footer">
    <p><strong>Critérios contábeis:</strong> Depreciação pelo método linear, vida útil estimada por categoria (NBC TG 27, ITG 2002 R1).
    Bens de parcerias públicas com cláusula de inalienabilidade (Art. 36, Lei 13.019/2014).</p>
    <p>Documento gerado em ${today} — ${org?.nome || "Instituto Dalton Salomão"}${org?.cnpj ? ` — CNPJ ${org.cnpj}` : ""}</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
