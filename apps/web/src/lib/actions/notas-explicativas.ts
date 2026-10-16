"use server";

import { prisma } from "@/lib/prisma";

export async function getNotasExplicativas() {
  const [
    bensAtivos,
    totalBens,
    baixados,
    categorias,
    origens,
    formasAquisicao,
    inalienaveisCount,
    remanescentesCount,
    parcerias,
    movimentacoes,
    depreciacao,
  ] = await Promise.all([
    prisma.bem.count({ where: { situacao: { not: "BAIXADO" } } }),
    prisma.bem.count(),
    prisma.bem.count({ where: { situacao: "BAIXADO" } }),
    prisma.bem.groupBy({
      by: ["categoriaId"],
      where: { situacao: { not: "BAIXADO" } },
      _count: true,
      _sum: { valorAquisicao: true, depreciacaoAcumulada: true },
    }),
    prisma.bem.groupBy({
      by: ["origemRecurso"],
      where: { situacao: { not: "BAIXADO" } },
      _count: true,
      _sum: { valorAquisicao: true },
    }),
    prisma.bem.groupBy({
      by: ["formaAquisicao"],
      where: { situacao: { not: "BAIXADO" } },
      _count: true,
      _sum: { valorAquisicao: true },
    }),
    prisma.bem.count({ where: { inalienabilidade: true, situacao: { not: "BAIXADO" } } }),
    prisma.bem.count({ where: { bemRemanescente: true, situacao: { not: "BAIXADO" } } }),
    prisma.parceria.findMany({
      where: { situacao: "vigente" },
      include: { _count: { select: { bens: true } } },
    }),
    prisma.movimentacao.groupBy({
      by: ["tipo"],
      _count: true,
    }),
    prisma.bem.aggregate({
      where: { situacao: { not: "BAIXADO" } },
      _sum: { valorAquisicao: true, depreciacaoAcumulada: true },
    }),
  ]);

  // Fetch category names
  const catIds = categorias.map((c) => c.categoriaId);
  const catNames = await prisma.categoria.findMany({
    where: { id: { in: catIds } },
    select: { id: true, nome: true, vidaUtilAnos: true, taxaAnual: true },
  });
  const catMap = Object.fromEntries(catNames.map((c) => [c.id, c]));

  const totalAquisicao = Number(depreciacao._sum.valorAquisicao ?? 0);
  const totalDeprec = Number(depreciacao._sum.depreciacaoAcumulada ?? 0);

  return {
    resumo: {
      bensAtivos,
      totalBens,
      baixados,
      totalAquisicao,
      totalDepreciacao: totalDeprec,
      valorContabil: totalAquisicao - totalDeprec,
      inalienaveisCount,
      remanescentesCount,
    },
    porCategoria: categorias.map((c) => ({
      categoria: catMap[c.categoriaId]?.nome ?? "Sem categoria",
      vidaUtilAnos: catMap[c.categoriaId]?.vidaUtilAnos ?? 0,
      taxaAnual: catMap[c.categoriaId]?.taxaAnual ?? 0,
      quantidade: c._count,
      valorAquisicao: Number(c._sum.valorAquisicao ?? 0),
      depreciacaoAcumulada: Number(c._sum.depreciacaoAcumulada ?? 0),
    })),
    porOrigem: origens.map((o) => ({
      origem: o.origemRecurso,
      quantidade: o._count,
      valor: Number(o._sum.valorAquisicao ?? 0),
    })),
    porFormaAquisicao: formasAquisicao.map((f) => ({
      forma: f.formaAquisicao,
      quantidade: f._count,
      valor: Number(f._sum.valorAquisicao ?? 0),
    })),
    parcerias: parcerias.map((p) => ({
      numero: p.numero,
      orgao: p.orgaoParceiro,
      tipo: p.tipo,
      bensVinculados: p._count.bens,
    })),
    movimentacoes: movimentacoes.map((m) => ({
      tipo: m.tipo,
      quantidade: m._count,
    })),
  };
}
