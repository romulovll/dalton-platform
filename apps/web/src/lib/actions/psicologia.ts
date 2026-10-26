"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { requireProfile } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";
import { TipoAtendimentoPsi, StatusAgendaPsi } from "@prisma/client";

export async function createAgendamento(formData: FormData) {
  await requireProfile("PSICOLOGO");
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  const participanteId = (formData.get("participanteId") as string) || null;
  const nomePessoa = (formData.get("nomePessoa") as string) || null;

  const agenda = await prisma.agendaPsicologia.create({
    data: {
      participanteId: participanteId || null,
      nomePessoa: participanteId ? null : nomePessoa,
      psicologoId: session.userId,
      unidadeId: (formData.get("unidadeId") as string) || null,
      dataHora: new Date(formData.get("dataHora") as string),
      duracao: parseInt(formData.get("duracao") as string) || 50,
      tipo: formData.get("tipo") as TipoAtendimentoPsi,
    },
  });

  await logAudit({
    acao: "CREATE",
    entidade: "AgendaPsicologia",
    entidadeId: agenda.id,
    dados: { tipo: agenda.tipo, data: formData.get("dataHora") },
  });

  redirect("/psicologia");
}

export async function updateStatusAgendamento(id: string, status: StatusAgendaPsi) {
  await requireProfile("PSICOLOGO");
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  // Only the psychologist who owns this appointment can update it
  const agenda = await prisma.agendaPsicologia.findUnique({ where: { id } });
  if (!agenda || agenda.psicologoId !== session.userId) {
    throw new Error("Acesso negado");
  }

  await prisma.agendaPsicologia.update({
    where: { id },
    data: {
      status,
      canceladoPor: status === "CANCELADO" ? session.userId : undefined,
    },
  });
}

export async function getAgenda(filters?: { data?: string; status?: string }) {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  const where: Record<string, unknown> = {};

  // Psychologists only see their own agenda
  if (session.perfil === "PSICOLOGO") {
    where.psicologoId = session.userId;
  }

  if (filters?.status) where.status = filters.status;

  if (filters?.data) {
    const date = new Date(filters.data);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    where.dataHora = { gte: date, lt: nextDay };
  }

  return prisma.agendaPsicologia.findMany({
    where,
    orderBy: { dataHora: "asc" },
    include: {
      participante: { select: { id: true, nome: true } },
      psicologo: { select: { nome: true } },
      unidade: { select: { nome: true } },
    },
  });
}

export async function getEstatisticasPsi() {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  const where: Record<string, unknown> = {};
  if (session.perfil === "PSICOLOGO") {
    where.psicologoId = session.userId;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const [agendadosHoje, realizadosMes, faltasMes, totalPessoas] = await Promise.all([
    prisma.agendaPsicologia.count({
      where: { ...where, dataHora: { gte: hoje, lt: amanha }, status: "AGENDADO" },
    }),
    prisma.agendaPsicologia.count({
      where: { ...where, dataHora: { gte: inicioMes }, status: "REALIZADO" },
    }),
    prisma.agendaPsicologia.count({
      where: { ...where, dataHora: { gte: inicioMes }, status: "FALTA" },
    }),
    prisma.agendaPsicologia.groupBy({
      by: ["participanteId"],
      where: { ...where, dataHora: { gte: inicioMes }, status: "REALIZADO" },
    }).then((r) => r.length),
  ]);

  return { agendadosHoje, realizadosMes, faltasMes, totalPessoas };
}
