"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { TipoChamado, PrioridadeChamado, SituacaoChamado } from "@prisma/client";
import { requireProfile } from "@/lib/rbac";

export async function createChamado(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  await prisma.chamado.create({
    data: {
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      tipo: formData.get("tipo") as TipoChamado,
      prioridade: (formData.get("prioridade") as PrioridadeChamado) || "MEDIA",
      usuarioId: session.userId,
    },
  });

  redirect("/chamados");
}

export async function updateChamado(id: string, formData: FormData) {
  await requireProfile("ADMIN_GERAL");
  const situacao = formData.get("situacao") as SituacaoChamado;
  const resposta = (formData.get("resposta") as string) || null;

  await prisma.chamado.update({
    where: { id },
    data: { situacao, resposta },
  });

  redirect("/chamados");
}

export async function getChamados(filters?: { situacao?: string }) {
  const where: Record<string, unknown> = {};
  if (filters?.situacao) where.situacao = filters.situacao;

  return prisma.chamado.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      usuario: { select: { nome: true } },
    },
  });
}

export async function getChamado(id: string) {
  return prisma.chamado.findUnique({
    where: { id },
    include: {
      usuario: { select: { nome: true, email: true } },
    },
  });
}
