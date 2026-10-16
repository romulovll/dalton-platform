export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getInventario } from "@/lib/actions/inventory";
import { InventarioDetail } from "./inventario-detail";

export default async function InventarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inventario = await getInventario(id);
  if (!inventario) notFound();

  const itens = inventario.itens.map((item) => ({
    id: item.id,
    status: item.status,
    observacoes: item.observacoes ?? "",
    verificadoEm: item.verificadoEm?.toISOString() ?? null,
    bem: {
      id: item.bem.id,
      tombamento: item.bem.tombamento,
      descricao: item.bem.descricao,
      localizacao: item.bem.localizacao ?? "",
      unidade: item.bem.unidadeAtual.nome,
    },
  }));

  return (
    <InventarioDetail
      inventario={{
        id: inventario.id,
        codigo: inventario.codigo,
        dataInicio: inventario.dataInicio.toLocaleDateString("pt-BR"),
        dataFim: inventario.dataFim?.toLocaleDateString("pt-BR") ?? null,
        situacao: inventario.situacao,
        responsavel: inventario.responsavel.nome,
        observacoes: inventario.observacoes ?? "",
      }}
      itens={itens}
    />
  );
}
