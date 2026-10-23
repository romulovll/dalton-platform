export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Building2, ArrowLeftRight, AlertTriangle, Users2, CalendarDays, ClipboardList } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CategoryChart, UnitPieChart, ValorChart } from "./charts";
import { getEstatisticasPresenca } from "@/lib/actions/presenca";

export default async function PainelPage() {
  const [
    totalBens,
    totalUnidades,
    totalMovimentacoes,
    bensInativos,
    presencaStats,
    bensByCategoria,
    bensByUnidade,
    valorByCategoria,
  ] = await Promise.all([
    prisma.bem.count(),
    prisma.unidade.count({ where: { situacao: "ATIVA" } }),
    prisma.movimentacao.count(),
    prisma.bem.count({
      where: { situacao: { in: ["EM_MANUTENCAO", "DESAPARECIDO"] } },
    }),
    getEstatisticasPresenca(),
    prisma.bem.groupBy({
      by: ["categoriaId"],
      where: { situacao: { not: "BAIXADO" } },
      _count: true,
    }),
    prisma.bem.groupBy({
      by: ["unidadeAtualId"],
      where: { situacao: { not: "BAIXADO" } },
      _count: true,
    }),
    prisma.bem.groupBy({
      by: ["categoriaId"],
      where: { situacao: { not: "BAIXADO" } },
      _sum: { valorAquisicao: true, depreciacaoAcumulada: true },
    }),
  ]);

  // Resolve names for charts
  const catIds = [...new Set([...bensByCategoria.map((b) => b.categoriaId), ...valorByCategoria.map((b) => b.categoriaId)])];
  const unitIds = bensByUnidade.map((b) => b.unidadeAtualId);
  const [cats, units] = await Promise.all([
    prisma.categoria.findMany({ where: { id: { in: catIds } }, select: { id: true, nome: true } }),
    prisma.unidade.findMany({ where: { id: { in: unitIds } }, select: { id: true, nome: true } }),
  ]);
  const catNames = Object.fromEntries(cats.map((c) => [c.id, c.nome]));
  const unitNames = Object.fromEntries(units.map((u) => [u.id, u.nome]));

  const chartByCategoria = bensByCategoria.map((b) => ({
    name: catNames[b.categoriaId] || "Outro",
    value: b._count,
  })).sort((a, b) => b.value - a.value);

  const chartByUnidade = bensByUnidade.map((b) => ({
    name: unitNames[b.unidadeAtualId] || "Outro",
    value: b._count,
  }));

  const chartValor = valorByCategoria.map((b) => {
    const aq = Number(b._sum.valorAquisicao ?? 0);
    const dep = Number(b._sum.depreciacaoAcumulada ?? 0);
    return {
      name: catNames[b.categoriaId] || "Outro",
      aquisicao: aq,
      contabil: aq - dep,
    };
  }).sort((a, b) => b.aquisicao - a.aquisicao);

  const stats = [
    {
      title: "Total de Bens",
      value: totalBens.toString(),
      description: "Bens cadastrados",
      icon: Package,
      color: "text-verde-escuro",
      bgColor: "bg-verde-escuro/10",
    },
    {
      title: "Unidades",
      value: totalUnidades.toString(),
      description: "Unidades ativas",
      icon: Building2,
      color: "text-verde-medio",
      bgColor: "bg-verde-medio/10",
    },
    {
      title: "Movimentações",
      value: totalMovimentacoes.toString(),
      description: "Total registradas",
      icon: ArrowLeftRight,
      color: "text-azul",
      bgColor: "bg-azul/10",
    },
    {
      title: "Pendências",
      value: bensInativos.toString(),
      description: "Requerem atenção",
      icon: AlertTriangle,
      color: "text-amarelo",
      bgColor: "bg-amarelo/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-texto-escuro">Painel</h1>
        <p className="text-cinza-medio mt-1">
          Visão geral do patrimônio do Instituto Dalton Salomão
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...stats,
          {
            title: "Participantes",
            value: presencaStats.participantesAtivos.toString(),
            description: "Participantes ativos",
            icon: Users2,
            color: "text-indigo-600",
            bgColor: "bg-indigo-100",
          },
          {
            title: "Atividades",
            value: presencaStats.atividadesAtivas.toString(),
            description: "Atividades ativas",
            icon: CalendarDays,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
          },
          {
            title: "Presença Hoje",
            value: presencaStats.presencaHoje.toString(),
            description: "Presenças registradas",
            icon: ClipboardList,
            color: "text-teal-600",
            bgColor: "bg-teal-100",
          },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cinza-medio">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-texto-escuro">
                {stat.value}
              </p>
              <p className="text-xs text-cinza-medio mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/bens/novo"
              className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-cinza-claro"
            >
              <div className="rounded-lg bg-verde-escuro/10 p-2">
                <Package className="h-4 w-4 text-verde-escuro" />
              </div>
              <div>
                <p className="text-sm font-medium">Cadastrar Novo Bem</p>
                <p className="text-xs text-cinza-medio">
                  Registrar um bem patrimonial no sistema
                </p>
              </div>
            </Link>
            <Link
              href="/unidades/nova"
              className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-cinza-claro"
            >
              <div className="rounded-lg bg-verde-medio/10 p-2">
                <Building2 className="h-4 w-4 text-verde-medio" />
              </div>
              <div>
                <p className="text-sm font-medium">Cadastrar Nova Unidade</p>
                <p className="text-xs text-cinza-medio">
                  Adicionar uma unidade do Instituto
                </p>
              </div>
            </Link>
            <Link
              href="/presenca"
              className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-cinza-claro"
            >
              <div className="rounded-lg bg-indigo-100 p-2">
                <ClipboardList className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Registrar Presença</p>
                <p className="text-xs text-cinza-medio">
                  Chamada diária das atividades
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Últimos Bens Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {totalBens === 0 ? (
              <div className="flex items-center justify-center h-40 text-cinza-medio text-sm">
                Nenhum bem cadastrado ainda.
              </div>
            ) : (
              <RecentAssets />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {totalBens > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Bens por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryChart data={chartByCategoria} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Distribuição por Unidade</CardTitle>
            </CardHeader>
            <CardContent>
              <UnitPieChart data={chartByUnidade} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Valor por Categoria (Aquisição vs Contábil)</CardTitle>
            </CardHeader>
            <CardContent>
              <ValorChart data={chartValor} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

async function RecentAssets() {
  const bens = await prisma.bem.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      tombamento: true,
      descricao: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-3">
      {bens.map((bem) => (
        <Link
          key={bem.id}
          href={`/bens/${bem.id}`}
          className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-cinza-claro"
        >
          <div>
            <p className="text-sm font-medium">{bem.descricao}</p>
            <p className="text-xs text-cinza-medio font-mono">{bem.tombamento}</p>
          </div>
          <p className="text-xs text-cinza-medio">
            {bem.createdAt.toLocaleDateString("pt-BR")}
          </p>
        </Link>
      ))}
    </div>
  );
}
