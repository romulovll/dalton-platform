import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { escapeHtml } from "@/lib/sanitize";

export async function GET() {
  const org = await prisma.organizacao.findFirst();
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    include: { tipos: { orderBy: { nome: "asc" } } },
  });
  const unidades = await prisma.unidade.findMany({
    where: { situacao: "ATIVA" },
    orderBy: { nome: "asc" },
  });

  const orgName = escapeHtml(org?.nome || "Instituto Dalton Salomão");
  const today = new Date().toLocaleDateString("pt-BR");

  // Generate multiple blank forms (3 per page works well)
  const blankForm = (n: number) => `
    <div class="form-card">
      <div class="form-header">
        <div class="form-title">${orgName} — Ficha de Cadastro de Bem Patrimonial</div>
        <div class="form-number">Ficha #${n}</div>
      </div>

      <table class="form-table">
        <tr>
          <td class="label" style="width:25%">Tombamento (preenchido pelo sistema)</td>
          <td class="field" style="width:25%">${escapeHtml(org?.prefixoTombamento || "IDS")}-__________</td>
          <td class="label" style="width:20%">Data do Levantamento</td>
          <td class="field" style="width:30%">____/____/________</td>
        </tr>
      </table>

      <div class="section-title">1. Identificação do Bem</div>
      <table class="form-table">
        <tr>
          <td class="label" style="width:15%">Descrição *</td>
          <td class="field" colspan="5"></td>
        </tr>
        <tr>
          <td class="label">Categoria *</td>
          <td class="field" style="width:35%"></td>
          <td class="label" style="width:10%">Tipo</td>
          <td class="field" style="width:35%"></td>
        </tr>
        <tr>
          <td class="label">Marca</td>
          <td class="field"></td>
          <td class="label">Modelo</td>
          <td class="field"></td>
        </tr>
        <tr>
          <td class="label">Nº de Série</td>
          <td class="field" colspan="3"></td>
        </tr>
      </table>

      <div class="section-title">2. Localização e Responsável</div>
      <table class="form-table">
        <tr>
          <td class="label" style="width:15%">Unidade *</td>
          <td class="field" style="width:35%"></td>
          <td class="label" style="width:15%">Setor / Sala</td>
          <td class="field" style="width:35%"></td>
        </tr>
        <tr>
          <td class="label">Responsável *</td>
          <td class="field" colspan="3"></td>
        </tr>
      </table>

      <div class="section-title">3. Dados de Aquisição</div>
      <table class="form-table">
        <tr>
          <td class="label" style="width:15%">Data Aquisição</td>
          <td class="field" style="width:18%">____/____/________</td>
          <td class="label" style="width:12%">Valor (R$)</td>
          <td class="field" style="width:18%"></td>
          <td class="label" style="width:12%">Nota Fiscal</td>
          <td class="field" style="width:25%"></td>
        </tr>
        <tr>
          <td class="label">Forma Aquis.</td>
          <td class="field" colspan="2">
            <span class="checkbox">☐ Compra</span>
            <span class="checkbox">☐ Doação</span>
            <span class="checkbox">☐ Cessão</span>
            <span class="checkbox">☐ Comodato</span>
          </td>
          <td class="label">Origem</td>
          <td class="field" colspan="2">
            <span class="checkbox">☐ Próprio</span>
            <span class="checkbox">☐ Parceria Pública</span>
            <span class="checkbox">☐ Doação</span>
          </td>
        </tr>
        <tr>
          <td class="label">Fornecedor</td>
          <td class="field" colspan="2"></td>
          <td class="label">Nº Parceria</td>
          <td class="field" colspan="2"></td>
        </tr>
      </table>

      <div class="section-title">4. Estado e Conformidade</div>
      <table class="form-table">
        <tr>
          <td class="label" style="width:15%">Conservação *</td>
          <td class="field" style="width:52%">
            <span class="checkbox">☐ Excelente</span>
            <span class="checkbox">☐ Bom</span>
            <span class="checkbox">☐ Regular</span>
            <span class="checkbox">☐ Ruim</span>
            <span class="checkbox">☐ Inservível</span>
          </td>
          <td class="label" style="width:10%">Inalienável</td>
          <td class="field" style="width:8%">
            <span class="checkbox">☐ Sim</span>
            <span class="checkbox">☐ Não</span>
          </td>
          <td class="label" style="width:10%">Remanesc.</td>
          <td class="field" style="width:8%">
            <span class="checkbox">☐ Sim</span>
            <span class="checkbox">☐ Não</span>
          </td>
        </tr>
      </table>

      <div class="section-title">5. Observações</div>
      <div class="obs-box"></div>

      <div class="form-footer">
        <div class="signature-line">
          <div class="sig-line"></div>
          <div class="sig-label">Responsável pelo levantamento</div>
        </div>
        <div class="signature-line">
          <div class="sig-line"></div>
          <div class="sig-label">Data e assinatura</div>
        </div>
      </div>
    </div>
  `;

  const forms = Array.from({ length: 9 }, (_, i) => blankForm(i + 1)).join("");

  const catList = categorias
    .map(
      (c) =>
        `<li><strong>${escapeHtml(c.nome)}</strong>${c.tipos.length > 0 ? `: ${c.tipos.map((t) => escapeHtml(t.nome)).join(", ")}` : ""}</li>`
    )
    .join("");

  const unitList = unidades
    .map((u) => `<li>${escapeHtml(u.nome)} (${escapeHtml(u.codigo)})</li>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Fichas de Cadastro — ${orgName}</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 8pt; color: #333; margin: 0; padding: 10mm; }

    .no-print { text-align: center; margin-bottom: 15px; }
    .no-print button { padding: 10px 30px; background: #1B5E34; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .no-print p { font-size: 12px; color: #666; margin-top: 8px; }
    @media print { .no-print { display: none; } .ref-page { page-break-before: always; } }

    .form-card {
      border: 1px solid #999;
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #1B5E34;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .form-title { font-size: 9pt; font-weight: bold; color: #1B5E34; }
    .form-number { font-size: 8pt; color: #999; }

    .section-title {
      font-size: 7.5pt;
      font-weight: bold;
      color: #1B5E34;
      margin: 5px 0 2px;
      border-bottom: 1px solid #8BC34A;
      padding-bottom: 1px;
    }

    .form-table { width: 100%; border-collapse: collapse; margin-bottom: 3px; }
    .form-table td { border: 1px solid #ccc; padding: 3px 4px; vertical-align: top; }
    .form-table .label { font-size: 6.5pt; color: #666; font-weight: bold; background: #f9f9f9; }
    .form-table .field { min-height: 16px; font-size: 8pt; }

    .checkbox { margin-right: 8px; font-size: 7pt; white-space: nowrap; }

    .obs-box { border: 1px solid #ccc; min-height: 24px; border-radius: 2px; }

    .form-footer { display: flex; justify-content: space-between; margin-top: 6px; }
    .signature-line { width: 45%; }
    .sig-line { border-bottom: 1px solid #333; height: 18px; }
    .sig-label { font-size: 6.5pt; color: #666; text-align: center; margin-top: 2px; }

    /* Reference page */
    .ref-page h2 { color: #1B5E34; font-size: 12pt; border-bottom: 2px solid #8BC34A; padding-bottom: 4px; }
    .ref-page h3 { color: #1B5E34; font-size: 9pt; margin-top: 10px; }
    .ref-page ul { font-size: 8pt; margin: 4px 0; padding-left: 20px; }
    .ref-page li { margin-bottom: 2px; }
    .ref-page .tip { background: #f0f7f0; border: 1px solid #8BC34A; border-radius: 4px; padding: 8px; margin: 10px 0; font-size: 8pt; }
  </style>
</head>
<body>
  <div class="no-print">
    <button onclick="window.print()">Imprimir Fichas de Cadastro</button>
    <p>9 fichas em branco + página de referência com categorias e unidades</p>
  </div>

  ${forms}

  <!-- Reference page -->
  <div class="ref-page" style="page-break-before: always;">
    <h2>${orgName} — Guia de Referência para Preenchimento</h2>
    <p style="font-size:8pt;color:#666">Gerado em ${today}</p>

    <div class="tip">
      <strong>Como preencher:</strong> Use estas fichas para registrar os bens encontrados durante o levantamento patrimonial.
      Depois, os dados serão inseridos no sistema em <strong>Bens → Importar CSV</strong> ou cadastrados individualmente.
      Campos marcados com * são obrigatórios.
    </div>

    <h3>Categorias e Tipos de Item</h3>
    <ul>${catList}</ul>

    <h3>Unidades Ativas</h3>
    <ul>${unitList}</ul>

    <h3>Formas de Aquisição</h3>
    <ul>
      <li><strong>Compra</strong> — Adquirido com recursos financeiros</li>
      <li><strong>Doação</strong> — Recebido como doação de pessoa física ou jurídica</li>
      <li><strong>Cessão</strong> — Cedido por outro órgão ou entidade</li>
      <li><strong>Comodato</strong> — Empréstimo gratuito com prazo determinado</li>
    </ul>

    <h3>Origem dos Recursos</h3>
    <ul>
      <li><strong>Próprio</strong> — Recursos da própria entidade</li>
      <li><strong>Parceria Pública</strong> — Recursos de convênio ou parceria com poder público (Lei 13.019/2014). Marcar como <em>Inalienável</em> e <em>Remanescente</em>.</li>
      <li><strong>Doação</strong> — Recurso recebido como doação</li>
    </ul>

    <h3>Estado de Conservação</h3>
    <ul>
      <li><strong>Excelente</strong> — Novo ou seminovo, sem defeitos</li>
      <li><strong>Bom</strong> — Funcionando normalmente, pequenos sinais de uso</li>
      <li><strong>Regular</strong> — Funcional mas com desgaste visível</li>
      <li><strong>Ruim</strong> — Funcionamento comprometido, necessita reparo</li>
      <li><strong>Inservível</strong> — Não funciona, candidato a baixa</li>
    </ul>

    <h3>Conformidade Legal</h3>
    <ul>
      <li><strong>Inalienável</strong> — Bem que não pode ser vendido ou doado (Art. 36, Lei 13.019/2014). Obrigatório para bens adquiridos com recursos de parcerias públicas.</li>
      <li><strong>Bem Remanescente</strong> — Bem de natureza permanente adquirido com recursos da parceria (Art. 2º, Lei 13.019/2014). Deve ter destino definido no plano de trabalho.</li>
    </ul>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
