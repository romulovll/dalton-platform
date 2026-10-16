export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getParceria } from "@/lib/actions/partnerships";
import { EditParceriaForm } from "./edit-parceria-form";

export default async function EditarParceriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parceria = await getParceria(id);
  if (!parceria) notFound();

  return (
    <EditParceriaForm
      parceria={{
        id: parceria.id,
        numero: parceria.numero,
        tipo: parceria.tipo,
        orgaoParceiro: parceria.orgaoParceiro,
        dataInicio: parceria.dataInicio.toISOString().split("T")[0],
        dataFim: parceria.dataFim?.toISOString().split("T")[0] ?? "",
        valorRepasse: parceria.valorRepasse ? Number(parceria.valorRepasse).toString() : "",
        situacao: parceria.situacao,
        observacoes: parceria.observacoes ?? "",
      }}
    />
  );
}
