"use server";

import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { requireProfile } from "@/lib/rbac";

/**
 * Calculate monthly depreciation for all active assets.
 * Uses linear method: (valorAquisicao - valorResidual) / vidaUtilMeses
 */
export async function runDepreciacao() {
  await requireProfile("CONTADOR");
  const bens = await prisma.bem.findMany({
    where: { situacao: "ATIVO" },
    include: { categoria: true },
  });

  let updated = 0;

  for (const bem of bens) {
    const vidaUtilMeses = bem.vidaUtilMeses || bem.categoria.vidaUtilAnos * 12;
    const valorResidual = Number(bem.valorResidual || 0);
    const valorAquisicao = Number(bem.valorAquisicao);
    const valorDepreciavel = valorAquisicao - valorResidual;

    if (valorDepreciavel <= 0 || vidaUtilMeses <= 0) continue;

    const depreciacaoMensal = valorDepreciavel / vidaUtilMeses;
    const depreciacaoAtual = Number(bem.depreciacaoAcumulada);
    const novaDepreciacao = Math.min(
      depreciacaoAtual + depreciacaoMensal,
      valorDepreciavel
    );

    // Skip if fully depreciated
    if (depreciacaoAtual >= valorDepreciavel) continue;

    await prisma.bem.update({
      where: { id: bem.id },
      data: { depreciacaoAcumulada: new Decimal(novaDepreciacao.toFixed(2)) },
    });
    updated++;
  }

  return { updated, total: bens.length };
}

/**
 * Get depreciation report data for all assets
 */
export async function getDepreciacaoReport() {
  const bens = await prisma.bem.findMany({
    where: { situacao: { not: "BAIXADO" } },
    include: {
      categoria: true,
      unidadeAtual: true,
    },
    orderBy: { tombamento: "asc" },
  });

  return bens.map((bem) => {
    const vidaUtilMeses = bem.vidaUtilMeses || bem.categoria.vidaUtilAnos * 12;
    const valorAquisicao = Number(bem.valorAquisicao);
    const valorResidual = Number(bem.valorResidual || 0);
    const depreciacaoAcumulada = Number(bem.depreciacaoAcumulada);
    const valorContabil = Math.max(valorAquisicao - depreciacaoAcumulada, valorResidual);
    const percentualDepreciado =
      valorAquisicao > 0 ? (depreciacaoAcumulada / (valorAquisicao - valorResidual)) * 100 : 0;

    return {
      id: bem.id,
      tombamento: bem.tombamento,
      descricao: bem.descricao,
      categoria: bem.categoria.nome,
      unidade: bem.unidadeAtual.nome,
      formaAquisicao: bem.formaAquisicao,
      valorAquisicao,
      valorResidual,
      depreciacaoAcumulada,
      valorContabil,
      vidaUtilMeses,
      taxaAnual: bem.categoria.taxaAnual,
      percentualDepreciado: Math.min(percentualDepreciado, 100),
    };
  });
}
