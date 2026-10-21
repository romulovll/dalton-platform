"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { requireProfile } from "@/lib/rbac";

export async function getPresencaDiaria(atividadeId: string, data: string) {
  const date = new Date(data);

  // Get all enrolled participants for this activity
  const enrolled = await prisma.atividadeParticipante.findMany({
    where: { atividadeId },
    include: {
      participante: {
        select: {
          id: true, nome: true, fotoUrl: true,
          saude: {
            select: {
              temAlergiaRemedio: true, descricaoAlergiaRemedio: true,
              temMedicacaoRegular: true, descricaoMedicacaoRegular: true,
              temProblemasSaude: true, descricaoProblemasSaude: true,
            },
          },
        },
      },
    },
    orderBy: { participante: { nome: "asc" } },
  });

  // Get existing attendance records for this date
  const existing = await prisma.presenca.findMany({
    where: { atividadeId, data: date },
  });
  const presencaMap = new Map(existing.map((p) => [p.participanteId, p]));

  return enrolled.map((e) => {
    const record = presencaMap.get(e.participante.id);
    return {
      participanteId: e.participante.id,
      nome: e.participante.nome,
      fotoUrl: e.participante.fotoUrl,
      saude: e.participante.saude,
      presente: record?.presente ?? false,
      observacao: record?.observacao ?? "",
      registrado: !!record,
    };
  });
}

export async function salvarPresenca(
  atividadeId: string,
  data: string,
  records: { participanteId: string; presente: boolean; observacao: string }[]
) {
  await requireProfile("PROFESSOR");
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  const date = new Date(data);

  await prisma.$transaction(
    records.map((r) =>
      prisma.presenca.upsert({
        where: {
          atividadeId_participanteId_data: {
            atividadeId,
            participanteId: r.participanteId,
            data: date,
          },
        },
        create: {
          atividadeId,
          participanteId: r.participanteId,
          data: date,
          presente: r.presente,
          observacao: r.observacao || null,
          registradoPorId: session.userId,
        },
        update: {
          presente: r.presente,
          observacao: r.observacao || null,
          registradoPorId: session.userId,
        },
      })
    )
  );
}

export async function getEstatisticasPresenca() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [participantesAtivos, atividadesAtivas, presencaHoje] = await Promise.all([
    prisma.participante.count({ where: { situacao: "ATIVO" } }),
    prisma.atividade.count({ where: { ativa: true } }),
    prisma.presenca.count({ where: { data: hoje, presente: true } }),
  ]);

  return { participantesAtivos, atividadesAtivas, presencaHoje };
}
