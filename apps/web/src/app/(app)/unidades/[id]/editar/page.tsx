export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { ArrowLeft } from "lucide-react";
import { getUnidade, updateUnit } from "@/lib/actions/units";
import { EditUnitForm } from "./edit-unit-form";

export default async function EditarUnidadePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const unidade = await getUnidade(id);

  if (!unidade) notFound();

  const updateWithId = updateUnit.bind(null, id);

  const dataInicio = unidade.dataInicio
    ? unidade.dataInicio.toISOString().split("T")[0]
    : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/unidades/${id}`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">
            Editar Unidade
          </h1>
          <p className="text-cinza-medio mt-1">
            {unidade.nome}
          </p>
        </div>
      </div>

      <EditUnitForm
        action={updateWithId}
        unidade={{
          codigo: unidade.codigo,
          nome: unidade.nome,
          responsavel: unidade.responsavel,
          telefone: unidade.telefone ?? "",
          email: unidade.email ?? "",
          situacao: unidade.situacao.toLowerCase(),
          logradouro: unidade.logradouro ?? "",
          numero: unidade.numero ?? "",
          bairro: unidade.bairro ?? "",
          complemento: unidade.complemento ?? "",
          cidade: unidade.cidade,
          uf: unidade.uf,
          cep: unidade.cep ?? "",
          dataInicio,
          observacoes: unidade.observacoes ?? "",
        }}
        backHref={`/unidades/${id}`}
      />
    </div>
  );
}
