"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TipoMovimentacao } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { requireProfile } from "@/lib/rbac";
import { sendEmail, emailTemplate } from "@/lib/email";

async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");
  return session;
}

export async function createTransferencia(formData: FormData) {
  await requireProfile("RESPONSAVEL_SETOR");
  const session = await requireUser();
  const bemId = formData.get("bemId") as string;
  const tipo = formData.get("tipo") as TipoMovimentacao;
  const motivo = formData.get("motivo") as string;
  const unidadeDestinoId = (formData.get("unidadeDestinoId") as string) || null;
  const setorDestinoId = (formData.get("setorDestinoId") as string) || null;
  const localizacao = (formData.get("localizacao") as string) || null;

  const bem = await prisma.bem.findUnique({
    where: { id: bemId },
    select: { unidadeAtualId: true, setorId: true },
  });
  if (!bem) throw new Error("Bem não encontrado");

  const [mov] = await prisma.$transaction([
    prisma.movimentacao.create({
      data: {
        bemId,
        tipo,
        motivo,
        unidadeOrigemId: bem.unidadeAtualId,
        unidadeDestinoId: tipo === "TRANSFERENCIA_UNIDADE" ? unidadeDestinoId : bem.unidadeAtualId,
        setorOrigemId: bem.setorId,
        setorDestinoId,
        usuarioId: session.userId,
      },
    }),
    prisma.bem.update({
      where: { id: bemId },
      data: {
        unidadeAtualId: tipo === "TRANSFERENCIA_UNIDADE" && unidadeDestinoId
          ? unidadeDestinoId
          : undefined,
        setorId: setorDestinoId,
        localizacao,
      },
    }),
  ]);

  await logAudit({
    acao: "CREATE",
    entidade: "Movimentacao",
    entidadeId: mov.id,
    bemId,
    dados: { tipo, motivo },
  });

  redirect("/movimentacoes");
}

export async function createBaixa(formData: FormData) {
  await requireProfile("GESTOR"); // Baixa requires GESTOR+
  const session = await requireUser();
  const bemId = formData.get("bemId") as string;
  const motivo = formData.get("motivo") as string;
  const documentoAutorizador = (formData.get("documento_autorizador") as string) || null;
  const observacoes = (formData.get("observacoes") as string) || null;

  const [mov] = await prisma.$transaction([
    prisma.movimentacao.create({
      data: {
        bemId,
        tipo: "BAIXA",
        motivo,
        documentoAutorizador,
        observacoes,
        usuarioId: session.userId,
      },
    }),
    prisma.bem.update({
      where: { id: bemId },
      data: { situacao: "BAIXADO" },
    }),
  ]);

  await logAudit({
    acao: "CREATE",
    entidade: "Movimentacao",
    entidadeId: mov.id,
    bemId,
    dados: { tipo: "BAIXA", motivo, documentoAutorizador },
  });

  // Notify admins about baixa
  const bem = await prisma.bem.findUnique({ where: { id: bemId }, select: { tombamento: true, descricao: true } });
  const adminUnidades = await prisma.usuarioUnidade.findMany({
    where: { perfil: { in: ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR"] } },
    select: { usuario: { select: { email: true, situacao: true } } },
  });
  const admins = adminUnidades
    .filter((au) => au.usuario.situacao === "ATIVO")
    .map((au) => ({ email: au.usuario.email }));
  if (admins.length > 0 && bem) {
    sendEmail({
      to: admins.map((a) => a.email),
      subject: `[Baixa] ${bem.tombamento} — ${bem.descricao}`,
      html: emailTemplate("Baixa de Bem Patrimonial", `
        <p><strong>Tombamento:</strong> ${bem.tombamento}</p>
        <p><strong>Descrição:</strong> ${bem.descricao}</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        ${documentoAutorizador ? `<p><strong>Documento:</strong> ${documentoAutorizador}</p>` : ""}
        <p><strong>Registrado por:</strong> ${session.nome}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
      `),
    });
  }

  redirect("/movimentacoes");
}

export async function createManutencao(formData: FormData) {
  await requireProfile("RESPONSAVEL_SETOR");
  const session = await requireUser();
  const bemId = formData.get("bemId") as string;
  const motivo = formData.get("motivo") as string;
  const tipo = formData.get("tipo") as TipoMovimentacao;
  const custoManutencao = formData.get("custo_manutencao")
    ? parseFloat(formData.get("custo_manutencao") as string)
    : null;
  const dataRetornoPrevisto = formData.get("data_retorno_previsto")
    ? new Date(formData.get("data_retorno_previsto") as string)
    : null;
  const dataRetornoReal = formData.get("data_retorno_real")
    ? new Date(formData.get("data_retorno_real") as string)
    : null;
  const observacoes = (formData.get("observacoes") as string) || null;

  const novaSituacao = tipo === "MANUTENCAO_ENVIO" ? "EM_MANUTENCAO" : "ATIVO";

  const [mov] = await prisma.$transaction([
    prisma.movimentacao.create({
      data: {
        bemId,
        tipo,
        motivo,
        custoManutencao,
        dataRetornoPrevisto,
        dataRetornoReal,
        observacoes,
        usuarioId: session.userId,
      },
    }),
    prisma.bem.update({
      where: { id: bemId },
      data: { situacao: novaSituacao },
    }),
  ]);

  await logAudit({
    acao: "CREATE",
    entidade: "Movimentacao",
    entidadeId: mov.id,
    bemId,
    dados: { tipo, motivo },
  });

  redirect("/movimentacoes");
}

export async function getMovimentacoes() {
  return prisma.movimentacao.findMany({
    orderBy: { data: "desc" },
    take: 50,
    include: {
      bem: { select: { id: true, tombamento: true, descricao: true } },
      usuario: { select: { nome: true } },
    },
  });
}
