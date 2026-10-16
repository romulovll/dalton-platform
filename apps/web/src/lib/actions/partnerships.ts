"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { requireProfile } from "@/lib/rbac";

export async function createParceria(formData: FormData) {
  await requireProfile("GESTOR");
  const parceria = await prisma.parceria.create({
    data: {
      numero: formData.get("numero") as string,
      tipo: formData.get("tipo") as string,
      orgaoParceiro: formData.get("orgao_parceiro") as string,
      dataInicio: new Date(formData.get("data_inicio") as string),
      dataFim: formData.get("data_fim")
        ? new Date(formData.get("data_fim") as string)
        : null,
      valorRepasse: formData.get("valor_repasse")
        ? parseFloat(formData.get("valor_repasse") as string)
        : null,
      situacao: (formData.get("situacao") as string) || "vigente",
      observacoes: (formData.get("observacoes") as string) || null,
    },
  });

  await logAudit({
    acao: "CREATE",
    entidade: "Parceria",
    entidadeId: parceria.id,
    dados: { numero: parceria.numero, orgao: parceria.orgaoParceiro },
  });

  redirect("/parcerias");
}

export async function updateParceria(id: string, formData: FormData) {
  await requireProfile("GESTOR");
  await prisma.parceria.update({
    where: { id },
    data: {
      numero: formData.get("numero") as string,
      tipo: formData.get("tipo") as string,
      orgaoParceiro: formData.get("orgao_parceiro") as string,
      dataInicio: new Date(formData.get("data_inicio") as string),
      dataFim: formData.get("data_fim")
        ? new Date(formData.get("data_fim") as string)
        : null,
      valorRepasse: formData.get("valor_repasse")
        ? parseFloat(formData.get("valor_repasse") as string)
        : null,
      situacao: (formData.get("situacao") as string) || "vigente",
      observacoes: (formData.get("observacoes") as string) || null,
    },
  });

  await logAudit({
    acao: "UPDATE",
    entidade: "Parceria",
    entidadeId: id,
    dados: { numero: formData.get("numero") },
  });

  redirect("/parcerias");
}

export async function getParcerias() {
  return prisma.parceria.findMany({
    orderBy: { dataInicio: "desc" },
    include: {
      _count: { select: { bens: true } },
    },
  });
}

export async function getParceria(id: string) {
  return prisma.parceria.findUnique({
    where: { id },
    include: {
      bens: {
        select: { id: true, tombamento: true, descricao: true, valorAquisicao: true, situacao: true },
        orderBy: { tombamento: "asc" },
      },
    },
  });
}
