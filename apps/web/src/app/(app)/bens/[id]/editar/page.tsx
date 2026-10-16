export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { ArrowLeft } from "lucide-react";
import { getBem, updateAsset } from "@/lib/actions/assets";
import { EditAssetForm } from "./edit-asset-form";

export default async function EditarBemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bem = await getBem(id);

  if (!bem) notFound();

  const updateWithId = updateAsset.bind(null, id);

  const dataAquisicao = bem.dataAquisicao.toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/bens/${id}`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">
            Editar Bem
          </h1>
          <p className="text-cinza-medio mt-1">
            {bem.tombamento} — {bem.descricao}
          </p>
        </div>
      </div>

      <EditAssetForm
        action={updateWithId}
        bem={{
          tombamento: bem.tombamento,
          descricao: bem.descricao,
          categoriaId: bem.categoriaId,
          tipoItemId: bem.tipoItemId ?? "",
          marca: bem.marca ?? "",
          modelo: bem.modelo ?? "",
          numeroSerie: bem.numeroSerie ?? "",
          unidadeId: bem.unidadeAtualId,
          localizacao: bem.localizacao ?? "",
          responsavel: bem.responsavel,
          dataAquisicao,
          valorAquisicao: String(Number(bem.valorAquisicao)),
          formaAquisicao: bem.formaAquisicao,
          notaFiscal: bem.notaFiscal ?? "",
          fornecedor: bem.fornecedor ?? "",
          origemRecurso: bem.origemRecurso,
          numeroParceria: bem.numeroParceria ?? "",
          estadoConservacao: bem.estadoConservacao,
          situacao: bem.situacao,
          vidaUtilMeses: bem.vidaUtilMeses ? String(bem.vidaUtilMeses) : "",
          valorResidual: bem.valorResidual ? String(Number(bem.valorResidual)) : "",
          inalienabilidade: bem.inalienabilidade,
          bemRemanescente: bem.bemRemanescente,
          observacoes: bem.observacoes ?? "",
        }}
        backHref={`/bens/${id}`}
      />
    </div>
  );
}
