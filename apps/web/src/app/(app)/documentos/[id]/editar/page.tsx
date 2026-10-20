export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditDocumentoForm } from "./edit-documento-form";

export default async function EditarDocumentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await prisma.documento.findUnique({ where: { id } });
  if (!doc) notFound();

  return (
    <EditDocumentoForm
      documento={{
        id: doc.id,
        titulo: doc.titulo,
        descricao: doc.descricao ?? "",
        categoria: doc.categoria,
        ano: doc.ano.toString(),
        publicado: doc.publicado,
      }}
    />
  );
}
