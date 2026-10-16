"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { requireProfile } from "@/lib/rbac";
import { sendEmail, emailTemplate } from "@/lib/email";
import { StatusVerificacao } from "@prisma/client";

export async function createInventario(formData: FormData) {
  await requireProfile("GESTOR");
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  // Generate inventory code
  const year = new Date().getFullYear();
  const count = await prisma.inventario.count({
    where: { codigo: { startsWith: `INV-${year}` } },
  });
  const codigo = `INV-${year}-${String(count + 1).padStart(3, "0")}`;

  const observacoes = (formData.get("observacoes") as string) || null;

  // Get all active assets
  const bens = await prisma.bem.findMany({
    where: { situacao: { not: "BAIXADO" } },
    select: { id: true },
  });

  const inventario = await prisma.inventario.create({
    data: {
      codigo,
      responsavelId: session.userId,
      observacoes,
      itens: {
        create: bens.map((b) => ({
          bemId: b.id,
          status: "PENDENTE",
        })),
      },
    },
  });

  await logAudit({
    acao: "CREATE",
    entidade: "Inventario",
    entidadeId: inventario.id,
    dados: { codigo, totalBens: bens.length },
  });

  redirect(`/inventarios/${inventario.id}`);
}

export async function updateItemStatus(
  itemId: string,
  status: StatusVerificacao,
  observacoes?: string
) {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  await prisma.inventarioItem.update({
    where: { id: itemId },
    data: {
      status,
      observacoes: observacoes || null,
      verificadoEm: new Date(),
      verificadoPor: session.userId,
    },
  });
}

export async function concluirInventario(id: string) {
  await requireProfile("GESTOR");
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  // Check all items are verified
  const pendentes = await prisma.inventarioItem.count({
    where: { inventarioId: id, status: "PENDENTE" },
  });

  if (pendentes > 0) {
    throw new Error(`Ainda existem ${pendentes} itens pendentes de verificação`);
  }

  await prisma.inventario.update({
    where: { id },
    data: { situacao: "CONCLUIDO", dataFim: new Date() },
  });

  // Mark non-located assets as DESAPARECIDO
  const naoLocalizados = await prisma.inventarioItem.findMany({
    where: { inventarioId: id, status: "NAO_LOCALIZADO" },
    select: { bemId: true },
  });

  for (const item of naoLocalizados) {
    await prisma.bem.update({
      where: { id: item.bemId },
      data: { situacao: "DESAPARECIDO" },
    });
  }

  await logAudit({
    acao: "UPDATE",
    entidade: "Inventario",
    entidadeId: id,
    dados: { situacao: "CONCLUIDO", bensDesaparecidos: naoLocalizados.length },
  });

  // Notify about inventory completion
  const inv = await prisma.inventario.findUnique({ where: { id }, select: { codigo: true } });
  const totalItens = await prisma.inventarioItem.count({ where: { inventarioId: id } });
  const adminUnidades = await prisma.usuarioUnidade.findMany({
    where: { perfil: { in: ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR"] } },
    select: { usuario: { select: { email: true, situacao: true } } },
  });
  const admins = adminUnidades
    .filter((au) => au.usuario.situacao === "ATIVO")
    .map((au) => ({ email: au.usuario.email }));
  if (admins.length > 0 && inv) {
    sendEmail({
      to: admins.map((a) => a.email),
      subject: `[Inventário Concluído] ${inv.codigo}`,
      html: emailTemplate("Inventário Concluído", `
        <p><strong>Código:</strong> ${inv.codigo}</p>
        <p><strong>Total de itens:</strong> ${totalItens}</p>
        <p><strong>Bens não localizados:</strong> ${naoLocalizados.length}</p>
        <p><strong>Concluído por:</strong> ${session.nome}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
        ${naoLocalizados.length > 0 ? `<p style="color:#D32F2F;font-weight:bold">Atenção: ${naoLocalizados.length} bem(ns) marcado(s) como DESAPARECIDO.</p>` : ""}
      `),
    });
  }

  redirect(`/inventarios/${id}`);
}

export async function getInventarios() {
  return prisma.inventario.findMany({
    orderBy: { dataInicio: "desc" },
    include: {
      responsavel: { select: { nome: true } },
      _count: {
        select: { itens: true },
      },
    },
  });
}

export async function getInventario(id: string) {
  return prisma.inventario.findUnique({
    where: { id },
    include: {
      responsavel: { select: { nome: true } },
      itens: {
        include: {
          bem: {
            select: {
              id: true,
              tombamento: true,
              descricao: true,
              localizacao: true,
              unidadeAtual: { select: { nome: true } },
            },
          },
        },
        orderBy: { bem: { tombamento: "asc" } },
      },
    },
  });
}
