"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SituacaoUnidade } from "@prisma/client";
import { logAudit } from "@/lib/audit";
import { requireProfile } from "@/lib/rbac";

export async function createUnit(formData: FormData) {
  await requireProfile("ADMIN_UNIDADE");
  const data = {
    codigo: formData.get("codigo") as string,
    nome: formData.get("nome") as string,
    responsavel: formData.get("responsavel") as string,
    telefone: (formData.get("telefone") as string) || null,
    email: (formData.get("email") as string) || null,
    logradouro: (formData.get("logradouro") as string) || null,
    numero: (formData.get("numero") as string) || null,
    complemento: (formData.get("complemento") as string) || null,
    bairro: (formData.get("bairro") as string) || null,
    cidade: formData.get("cidade") as string,
    uf: (formData.get("uf") as string) || "SP",
    cep: (formData.get("cep") as string) || null,
    situacao: (formData.get("situacao") as SituacaoUnidade) || "ATIVA",
    dataInicio: formData.get("data_inicio")
      ? new Date(formData.get("data_inicio") as string)
      : null,
    observacoes: (formData.get("observacoes") as string) || null,
    organizacaoId: "org-dalton",
  };

  const unidade = await prisma.unidade.create({ data });

  await logAudit({
    acao: "CREATE",
    entidade: "Unidade",
    entidadeId: unidade.id,
    dados: { codigo: data.codigo, nome: data.nome },
  });

  redirect("/unidades");
}

export async function getUnidades() {
  return prisma.unidade.findMany({
    orderBy: { codigo: "asc" },
    include: {
      _count: { select: { bens: true } },
    },
  });
}

export async function getUnidade(id: string) {
  return prisma.unidade.findUnique({
    where: { id },
    include: {
      setores: { orderBy: { nome: "asc" } },
      _count: { select: { bens: true } },
    },
  });
}

export async function updateUnit(id: string, formData: FormData) {
  await requireProfile("ADMIN_UNIDADE");
  await prisma.unidade.update({
    where: { id },
    data: {

      codigo: formData.get("codigo") as string,
      nome: formData.get("nome") as string,
      responsavel: formData.get("responsavel") as string,
      telefone: (formData.get("telefone") as string) || null,
      email: (formData.get("email") as string) || null,
      logradouro: (formData.get("logradouro") as string) || null,
      numero: (formData.get("numero") as string) || null,
      complemento: (formData.get("complemento") as string) || null,
      bairro: (formData.get("bairro") as string) || null,
      cidade: formData.get("cidade") as string,
      uf: (formData.get("uf") as string) || "SP",
      cep: (formData.get("cep") as string) || null,
      situacao: (formData.get("situacao") as SituacaoUnidade) || "ATIVA",
      dataInicio: formData.get("data_inicio")
        ? new Date(formData.get("data_inicio") as string)
        : null,
      observacoes: (formData.get("observacoes") as string) || null,
    },
  });

  await logAudit({
    acao: "UPDATE",
    entidade: "Unidade",
    entidadeId: id,
    dados: { codigo: formData.get("codigo"), nome: formData.get("nome") },
  });

  redirect("/unidades");
}

// Sectors
export async function createSetor(unidadeId: string, nome: string) {
  await requireProfile("ADMIN_UNIDADE");
  await prisma.setor.create({ data: { nome, unidadeId } });
}

export async function deleteSetor(id: string) {
  await requireProfile("ADMIN_UNIDADE");
  await prisma.setor.delete({ where: { id } });
}

export async function getSetoresByUnidade(unidadeId: string) {
  return prisma.setor.findMany({
    where: { unidadeId },
    orderBy: { nome: "asc" },
    include: { _count: { select: { bens: true } } },
  });
}
