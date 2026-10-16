"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  FormaAquisicao,
  OrigemRecurso,
  EstadoConservacao,
  SituacaoBem,
} from "@prisma/client";
import { logAudit } from "@/lib/audit";
import { requireProfile } from "@/lib/rbac";

export async function createAsset(formData: FormData) {
  await requireProfile("RESPONSAVEL_SETOR");
  // Generate tombamento number
  const org = await prisma.organizacao.findFirst();
  if (!org) throw new Error("Organização não encontrada");

  const tombamento = `${org.prefixoTombamento}-${String(org.proximoTombamento).padStart(6, "0")}`;

  const data = {
    tombamento,
    descricao: formData.get("descricao") as string,
    categoriaId: formData.get("categoriaId") as string,
    tipoItemId: (formData.get("tipoItemId") as string) || null,
    marca: (formData.get("marca") as string) || null,
    modelo: (formData.get("modelo") as string) || null,
    numeroSerie: (formData.get("numero_serie") as string) || null,
    unidadeAtualId: formData.get("unidadeId") as string,
    setorId: (formData.get("setorId") as string) || null,
    localizacao: (formData.get("localizacao") as string) || null,
    responsavel: formData.get("responsavel") as string,
    dataAquisicao: new Date(formData.get("data_aquisicao") as string),
    valorAquisicao: parseFloat(formData.get("valor_aquisicao") as string),
    formaAquisicao: (formData.get("forma_aquisicao") as FormaAquisicao) || "COMPRA",
    notaFiscal: (formData.get("nota_fiscal") as string) || null,
    fornecedor: (formData.get("fornecedor") as string) || null,
    origemRecurso: (formData.get("origem_recurso") as OrigemRecurso) || "PROPRIO",
    numeroParceria: (formData.get("numero_parceria") as string) || null,
    estadoConservacao: (formData.get("estado_conservacao") as EstadoConservacao) || "BOM",
    situacao: (formData.get("situacao") as SituacaoBem) || "ATIVO",
    vidaUtilMeses: formData.get("vida_util")
      ? parseInt(formData.get("vida_util") as string)
      : null,
    valorResidual: formData.get("valor_residual")
      ? parseFloat(formData.get("valor_residual") as string)
      : null,
    inalienabilidade: formData.get("inalienabilidade") === "on",
    bemRemanescente: formData.get("bem_remanescente") === "on",
    observacoes: (formData.get("observacoes") as string) || null,
  };

  const [bem] = await prisma.$transaction([
    prisma.bem.create({ data }),
    prisma.organizacao.update({
      where: { id: org.id },
      data: { proximoTombamento: org.proximoTombamento + 1 },
    }),
  ]);

  await logAudit({
    acao: "CREATE",
    entidade: "Bem",
    entidadeId: bem.id,
    bemId: bem.id,
    dados: { tombamento, descricao: data.descricao },
  });

  redirect("/bens");
}

export async function getBens(filters?: {
  unidadeId?: string;
  categoriaId?: string;
  estado?: string;
  situacao?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.unidadeId) where.unidadeAtualId = filters.unidadeId;
  if (filters?.categoriaId) where.categoriaId = filters.categoriaId;
  if (filters?.estado) where.estadoConservacao = filters.estado;
  if (filters?.situacao) where.situacao = filters.situacao;
  if (filters?.search) {
    where.OR = [
      { tombamento: { contains: filters.search, mode: "insensitive" } },
      { descricao: { contains: filters.search, mode: "insensitive" } },
      { marca: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.bem.findMany({
    where,
    orderBy: { tombamento: "asc" },
    include: {
      categoria: true,
      tipoItem: true,
      unidadeAtual: true,
    },
  });
}

export async function getBem(id: string) {
  return prisma.bem.findUnique({
    where: { id },
    include: {
      categoria: true,
      tipoItem: true,
      unidadeAtual: true,
      setor: true,
      movimentacoes: {
        orderBy: { data: "desc" },
        include: { usuario: true },
      },
    },
  });
}

export async function updateAsset(id: string, formData: FormData) {
  await requireProfile("RESPONSAVEL_SETOR");
  const before = await prisma.bem.findUnique({ where: { id } });
  await prisma.bem.update({
    where: { id },
    data: {
      descricao: formData.get("descricao") as string,
      categoriaId: formData.get("categoriaId") as string,
      tipoItemId: (formData.get("tipoItemId") as string) || null,
      marca: (formData.get("marca") as string) || null,
      modelo: (formData.get("modelo") as string) || null,
      numeroSerie: (formData.get("numero_serie") as string) || null,
      unidadeAtualId: formData.get("unidadeId") as string,
      localizacao: (formData.get("localizacao") as string) || null,
      responsavel: formData.get("responsavel") as string,
      dataAquisicao: new Date(formData.get("data_aquisicao") as string),
      valorAquisicao: parseFloat(formData.get("valor_aquisicao") as string),
      formaAquisicao: (formData.get("forma_aquisicao") as FormaAquisicao) || "COMPRA",
      notaFiscal: (formData.get("nota_fiscal") as string) || null,
      fornecedor: (formData.get("fornecedor") as string) || null,
      origemRecurso: (formData.get("origem_recurso") as OrigemRecurso) || "PROPRIO",
      numeroParceria: (formData.get("numero_parceria") as string) || null,
      estadoConservacao: (formData.get("estado_conservacao") as EstadoConservacao) || "BOM",
      situacao: (formData.get("situacao") as SituacaoBem) || "ATIVO",
      vidaUtilMeses: formData.get("vida_util")
        ? parseInt(formData.get("vida_util") as string)
        : null,
      valorResidual: formData.get("valor_residual")
        ? parseFloat(formData.get("valor_residual") as string)
        : null,
      inalienabilidade: formData.get("inalienabilidade") === "on",
      bemRemanescente: formData.get("bem_remanescente") === "on",
      observacoes: (formData.get("observacoes") as string) || null,
    },
  });

  await logAudit({
    acao: "UPDATE",
    entidade: "Bem",
    entidadeId: id,
    bemId: id,
    dados: {
      tombamento: before?.tombamento,
      descricao: formData.get("descricao") as string,
    },
  });

  redirect(`/bens/${id}`);
}

export async function getCategorias() {
  return prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    include: {
      tipos: { orderBy: { nome: "asc" } },
      _count: { select: { bens: true } },
    },
  });
}
