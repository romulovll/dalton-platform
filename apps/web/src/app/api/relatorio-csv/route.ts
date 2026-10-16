import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bens = await prisma.bem.findMany({
    include: {
      categoria: true,
      tipoItem: true,
      unidadeAtual: true,
    },
    orderBy: { tombamento: "asc" },
  });

  const header = [
    "Tombamento",
    "Descrição",
    "Categoria",
    "Tipo",
    "Unidade",
    "Responsável",
    "Data Aquisição",
    "Valor Aquisição",
    "Forma Aquisição",
    "Origem Recurso",
    "Estado Conservação",
    "Situação",
    "Vida Útil (meses)",
    "Valor Residual",
    "Depreciação Acumulada",
    "Valor Contábil",
    "Inalienável",
    "Bem Remanescente",
    "Nota Fiscal",
    "Fornecedor",
  ].join(";");

  const rows = bens.map((bem) => {
    const valorAquisicao = Number(bem.valorAquisicao);
    const depreciacaoAcumulada = Number(bem.depreciacaoAcumulada);
    const valorResidual = Number(bem.valorResidual || 0);
    const valorContabil = Math.max(valorAquisicao - depreciacaoAcumulada, valorResidual);
    const vidaUtil = bem.vidaUtilMeses || bem.categoria.vidaUtilAnos * 12;

    return [
      bem.tombamento,
      `"${bem.descricao}"`,
      bem.categoria.nome,
      bem.tipoItem?.nome || "",
      bem.unidadeAtual.nome,
      bem.responsavel,
      bem.dataAquisicao.toLocaleDateString("pt-BR"),
      valorAquisicao.toFixed(2).replace(".", ","),
      bem.formaAquisicao,
      bem.origemRecurso,
      bem.estadoConservacao,
      bem.situacao,
      vidaUtil.toString(),
      valorResidual.toFixed(2).replace(".", ","),
      depreciacaoAcumulada.toFixed(2).replace(".", ","),
      valorContabil.toFixed(2).replace(".", ","),
      bem.inalienabilidade ? "Sim" : "Não",
      bem.bemRemanescente ? "Sim" : "Não",
      bem.notaFiscal || "",
      bem.fornecedor || "",
    ].join(";");
  });

  const csv = "\uFEFF" + [header, ...rows].join("\n"); // BOM for Excel pt-BR

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="relatorio_patrimonial_${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
