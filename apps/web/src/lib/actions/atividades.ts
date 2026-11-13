"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { requireProfile } from "@/lib/rbac";
import { getSession } from "@/lib/auth";
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
  const session = await getSession();
  const where: Record<string, unknown> = {};
  if (filters?.unidadeId) where.unidadeId = filters.unidadeId;
  if (filters?.publicoAlvo) where.publicoAlvo = filters.publicoAlvo;

  // Professors only see activities they're assigned to
  if (session?.perfil === "PROFESSOR") {
    where.OR = [
      { usuarioId: session.userId },
      { professores: { some: { usuarioId: session.userId } } },
    ];
  }

  return prisma.atividade.findMany({
    where,
    orderBy: { nome: "asc" },
    include: {
      unidade: { select: { nome: true } },
      usuario: { select: { nome: true } },
      professores: { include: { usuario: { select: { id: true, nome: true } } } },
      _count: { select: { participantes: true, presencas: true } },
    },
  });
}

export async function getAtividade(id: string) {
  const session = await getSession();

  const atividade = await prisma.atividade.findUnique({
    where: { id },
    include: {
      unidade: true,
      usuario: { select: { nome: true } },
      professores: { include: { usuario: { select: { id: true, nome: true } } } },
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

  // Professors can only see activities they're assigned to
  if (atividade && session?.perfil === "PROFESSOR") {
    const isAssigned = atividade.usuarioId === session.userId ||
      atividade.professores.some((p) => p.usuario.id === session.userId);
    if (!isAssigned) return null;
  }

  return atividade;
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

export async function toggleParticipanteEnrollment(atividadeId: string, participanteId: string) {
  await requireProfile("GESTOR");
  const enrollment = await prisma.atividadeParticipante.findFirst({
    where: { atividadeId, participanteId },
  });
  if (enrollment) {
    await prisma.atividadeParticipante.update({
      where: { id: enrollment.id },
      data: { ativo: !enrollment.ativo },
    });
  }
  redirect(`/atividades/${atividadeId}`);
}

export async function addProfessorToAtividade(atividadeId: string, usuarioId: string) {
  await requireProfile("GESTOR");
  await prisma.atividadeProfessor.create({
    data: { atividadeId, usuarioId },
  });
  redirect(`/atividades/${atividadeId}`);
}

export async function removeProfessorFromAtividade(atividadeId: string, usuarioId: string) {
  await requireProfile("GESTOR");
  await prisma.atividadeProfessor.deleteMany({
    where: { atividadeId, usuarioId },
  });
  redirect(`/atividades/${atividadeId}`);
}

export async function getProfessoresDisponiveis(atividadeId: string) {
  const assigned = await prisma.atividadeProfessor.findMany({
    where: { atividadeId },
    select: { usuarioId: true },
  });
  const assignedIds = assigned.map((a) => a.usuarioId);

  return prisma.usuario.findMany({
    where: {
      situacao: "ATIVO",
      id: { notIn: assignedIds },
      unidades: { some: { perfil: { in: ["PROFESSOR", "GESTOR", "ADMIN_GERAL", "ADMIN_UNIDADE"] } } },
    },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, email: true },
  });
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
