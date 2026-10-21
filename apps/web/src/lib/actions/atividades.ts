"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { requireProfile } from "@/lib/rbac";
import { PublicoAlvo } from "@prisma/client";

export async function createAtividade(formData: FormData) {
  await requireProfile("GESTOR");

  const atividade = await prisma.atividade.create({
    data: {
      nome: formData.get("nome") as string,
      descricao: (formData.get("descricao") as string) || null,
      publicoAlvo: formData.get("publicoAlvo") as PublicoAlvo,
      unidadeId: (formData.get("unidadeId") as string) || null,
      usuarioId: (formData.get("usuarioId") as string) || null,
    },
  });

  await logAudit({
    acao: "CREATE",
    entidade: "Atividade",
    entidadeId: atividade.id,
    dados: { nome: atividade.nome },
  });

  redirect("/atividades");
}

export async function updateAtividade(id: string, formData: FormData) {
  await requireProfile("GESTOR");

  await prisma.atividade.update({
    where: { id },
    data: {
      nome: formData.get("nome") as string,
      descricao: (formData.get("descricao") as string) || null,
      publicoAlvo: formData.get("publicoAlvo") as PublicoAlvo,
      unidadeId: (formData.get("unidadeId") as string) || null,
      usuarioId: (formData.get("usuarioId") as string) || null,
      ativa: formData.get("ativa") !== "off",
    },
  });

  await logAudit({
    acao: "UPDATE",
    entidade: "Atividade",
    entidadeId: id,
    dados: { nome: formData.get("nome") },
  });

  redirect(`/atividades/${id}`);
}

export async function getAtividades(filters?: { unidadeId?: string; publicoAlvo?: string }) {
  const where: Record<string, unknown> = {};
  if (filters?.unidadeId) where.unidadeId = filters.unidadeId;
  if (filters?.publicoAlvo) where.publicoAlvo = filters.publicoAlvo;

  return prisma.atividade.findMany({
    where,
    orderBy: { nome: "asc" },
    include: {
      unidade: { select: { nome: true } },
      usuario: { select: { nome: true } },
      _count: { select: { participantes: true, presencas: true } },
    },
  });
}

export async function getAtividade(id: string) {
  return prisma.atividade.findUnique({
    where: { id },
    include: {
      unidade: true,
      usuario: { select: { nome: true } },
      participantes: {
        include: {
          participante: {
            select: { id: true, nome: true, cpf: true, dataNascimento: true, fotoUrl: true,
              saude: { select: { temAlergiaRemedio: true, temMedicacaoRegular: true, temProblemasSaude: true } },
            },
          },
        },
        orderBy: { participante: { nome: "asc" } },
      },
    },
  });
}

export async function addParticipanteToAtividade(atividadeId: string, participanteId: string) {
  await requireProfile("GESTOR");
  await prisma.atividadeParticipante.create({
    data: { atividadeId, participanteId },
  });
  redirect(`/atividades/${atividadeId}`);
}

export async function removeParticipanteFromAtividade(atividadeId: string, participanteId: string) {
  await requireProfile("GESTOR");
  await prisma.atividadeParticipante.deleteMany({
    where: { atividadeId, participanteId },
  });
  redirect(`/atividades/${atividadeId}`);
}

export async function getParticipantesDisponiveis(atividadeId: string) {
  const enrolled = await prisma.atividadeParticipante.findMany({
    where: { atividadeId },
    select: { participanteId: true },
  });
  const enrolledIds = enrolled.map((e) => e.participanteId);

  return prisma.participante.findMany({
    where: {
      situacao: "ATIVO",
      id: { notIn: enrolledIds },
    },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, cpf: true },
  });
}
