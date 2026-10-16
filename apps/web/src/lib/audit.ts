import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function logAudit(params: {
  acao: "CREATE" | "UPDATE" | "DELETE";
  entidade: string;
  entidadeId: string;
  bemId?: string | null;
  dados?: Record<string, unknown> | null;
}) {
  const session = await getSession();
  if (!session) return;

  await prisma.auditLog.create({
    data: {
      acao: params.acao,
      entidade: params.entidade,
      entidadeId: params.entidadeId,
      bemId: params.bemId ?? null,
      dados: params.dados
        ? (params.dados as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      usuarioId: session.userId,
    },
  });
}
