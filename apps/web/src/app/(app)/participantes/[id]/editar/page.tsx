export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { ArrowLeft } from "lucide-react";
import { getParticipante, updateParticipante } from "@/lib/actions/participantes";
import { EditParticipanteForm } from "./edit-participante-form";

export default async function EditarParticipantePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const participante = await getParticipante(id);

  if (!participante) notFound();

  const updateWithId = updateParticipante.bind(null, id);

  const dataNascimento = participante.dataNascimento.toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/participantes/${id}`}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Editar Participante</h1>
          <p className="text-cinza-medio mt-1">{participante.nome}</p>
        </div>
      </div>

      <EditParticipanteForm
        action={updateWithId}
        participante={{
          nome: participante.nome,
          cpf: participante.cpf ?? "",
          rg: participante.rg ?? "",
          dataNascimento,
          telefone: participante.telefone ?? "",
          endereco: participante.endereco ?? "",
          unidadeId: participante.unidadeId,
          situacao: participante.situacao,
        }}
        backHref={`/participantes/${id}`}
      />
    </div>
  );
}
