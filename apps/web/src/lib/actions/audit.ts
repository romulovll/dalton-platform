"use server";

import { prisma } from "@/lib/prisma";

export async function getAuditLogs(filters?: {
  entidade?: string;
  acao?: string;
  search?: string;
  page?: number;
}) {
  const pageSize = 50;
  const page = filters?.page ?? 1;
  const where: Record<string, unknown> = {};

  if (filters?.entidade) where.entidade = filters.entidade;
  if (filters?.acao) where.acao = filters.acao;
  if (filters?.search) {
    where.OR = [
      { entidadeId: { contains: filters.search, mode: "insensitive" } },
      { usuario: { nome: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        usuario: { select: { nome: true, email: true } },
        bem: { select: { tombamento: true, descricao: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
