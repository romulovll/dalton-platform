"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { requireProfile } from "@/lib/rbac";
import { SituacaoParticipante } from "@prisma/client";

export async function createParticipante(formData: FormData) {
  await requireProfile("GESTOR");

  const participante = await prisma.participante.create({
    data: {
      nome: formData.get("nome") as string,
      cpf: (formData.get("cpf") as string) || null,
      rg: (formData.get("rg") as string) || null,
      dataNascimento: new Date(formData.get("data_nascimento") as string),
      telefone: (formData.get("telefone") as string) || null,
      endereco: (formData.get("endereco") as string) || null,
      unidadeId: formData.get("unidadeId") as string,
      situacao: "ATIVO",
    },
  });

  // Create empty sub-tables
  await Promise.all([
    prisma.saudeParticipante.create({ data: { participanteId: participante.id } }),
    prisma.escolaParticipante.create({ data: { participanteId: participante.id } }),
    prisma.moradiaParticipante.create({ data: { participanteId: participante.id } }),
    prisma.filiacaoParticipante.create({ data: { participanteId: participante.id } }),
    prisma.autorizacaoParticipante.create({ data: { participanteId: participante.id } }),
    prisma.observacaoParticipante.create({ data: { participanteId: participante.id } }),
  ]);

  await logAudit({
    acao: "CREATE",
    entidade: "Participante",
    entidadeId: participante.id,
    dados: { nome: participante.nome },
  });

  redirect(`/participantes/${participante.id}`);
}

export async function updateParticipante(id: string, formData: FormData) {
  await requireProfile("GESTOR");

  await prisma.participante.update({
    where: { id },
    data: {
      nome: formData.get("nome") as string,
      cpf: (formData.get("cpf") as string) || null,
      rg: (formData.get("rg") as string) || null,
      dataNascimento: new Date(formData.get("data_nascimento") as string),
      telefone: (formData.get("telefone") as string) || null,
      endereco: (formData.get("endereco") as string) || null,
      unidadeId: formData.get("unidadeId") as string,
      situacao: (formData.get("situacao") as SituacaoParticipante) || "ATIVO",
    },
  });

  await logAudit({
    acao: "UPDATE",
    entidade: "Participante",
    entidadeId: id,
    dados: { nome: formData.get("nome") },
  });

  redirect(`/participantes/${id}`);
}

export async function getParticipantes(filters?: {
  search?: string;
  unidadeId?: string;
  situacao?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.unidadeId) where.unidadeId = filters.unidadeId;
  if (filters?.situacao) where.situacao = filters.situacao;
  if (filters?.search) {
    where.OR = [
      { nome: { contains: filters.search, mode: "insensitive" } },
      { cpf: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.participante.findMany({
    where,
    orderBy: { nome: "asc" },
    include: {
      unidade: { select: { nome: true } },
      saude: { select: { temAlergiaRemedio: true, temMedicacaoRegular: true, temProblemasSaude: true } },
      _count: { select: { presencas: true } },
    },
  });
}

export async function getParticipante(id: string) {
  return prisma.participante.findUnique({
    where: { id },
    include: {
      unidade: true,
      responsaveis: { orderBy: { createdAt: "asc" } },
      saude: true,
      escola: true,
      moradia: true,
      filiacao: true,
      autorizacao: true,
      membrosF: { orderBy: { createdAt: "asc" } },
      observacao: true,
      atividades: {
        include: { atividade: { select: { id: true, nome: true, publicoAlvo: true } } },
      },
      presencas: {
        orderBy: { data: "desc" },
        take: 20,
        include: { atividade: { select: { nome: true } } },
      },
    },
  });
}

// Sub-table updates

export async function updateSaude(participanteId: string, formData: FormData) {
  await requireProfile("GESTOR");
  await prisma.saudeParticipante.upsert({
    where: { participanteId },
    create: {
      participanteId,
      temProblemasSaude: formData.get("temProblemasSaude") === "on",
      descricaoProblemasSaude: (formData.get("descricaoProblemasSaude") as string) || null,
      temDeficiencia: formData.get("temDeficiencia") === "on",
      descricaoDeficiencia: (formData.get("descricaoDeficiencia") as string) || null,
      temAlergiaRemedio: formData.get("temAlergiaRemedio") === "on",
      descricaoAlergiaRemedio: (formData.get("descricaoAlergiaRemedio") as string) || null,
      temIntoleranciaAlimentar: formData.get("temIntoleranciaAlimentar") === "on",
      descricaoIntoleranciaAlimentar: (formData.get("descricaoIntoleranciaAlimentar") as string) || null,
      temMedicacaoRegular: formData.get("temMedicacaoRegular") === "on",
      descricaoMedicacaoRegular: (formData.get("descricaoMedicacaoRegular") as string) || null,
    },
    update: {
      temProblemasSaude: formData.get("temProblemasSaude") === "on",
      descricaoProblemasSaude: (formData.get("descricaoProblemasSaude") as string) || null,
      temDeficiencia: formData.get("temDeficiencia") === "on",
      descricaoDeficiencia: (formData.get("descricaoDeficiencia") as string) || null,
      temAlergiaRemedio: formData.get("temAlergiaRemedio") === "on",
      descricaoAlergiaRemedio: (formData.get("descricaoAlergiaRemedio") as string) || null,
      temIntoleranciaAlimentar: formData.get("temIntoleranciaAlimentar") === "on",
      descricaoIntoleranciaAlimentar: (formData.get("descricaoIntoleranciaAlimentar") as string) || null,
      temMedicacaoRegular: formData.get("temMedicacaoRegular") === "on",
      descricaoMedicacaoRegular: (formData.get("descricaoMedicacaoRegular") as string) || null,
    },
  });
  redirect(`/participantes/${participanteId}`);
}

export async function updateEscola(participanteId: string, formData: FormData) {
  await requireProfile("GESTOR");
  await prisma.escolaParticipante.upsert({
    where: { participanteId },
    create: {
      participanteId,
      nomeEscola: (formData.get("nomeEscola") as string) || null,
      periodo: (formData.get("periodo") as string) || null,
      serie: (formData.get("serie") as string) || null,
    },
    update: {
      nomeEscola: (formData.get("nomeEscola") as string) || null,
      periodo: (formData.get("periodo") as string) || null,
      serie: (formData.get("serie") as string) || null,
    },
  });
  redirect(`/participantes/${participanteId}`);
}

export async function updateMoradia(participanteId: string, formData: FormData) {
  await requireProfile("GESTOR");
  const tipoImovel = formData.get("tipoImovel") as string;
  await prisma.moradiaParticipante.upsert({
    where: { participanteId },
    create: {
      participanteId,
      tipoImovel: tipoImovel ? (tipoImovel as "PROPRIO" | "ALUGADO" | "CEDIDO" | "OUTRO") : null,
      tipoImovelOutro: (formData.get("tipoImovelOutro") as string) || null,
      valorAluguel: formData.get("valorAluguel") ? parseInt(formData.get("valorAluguel") as string) : null,
      temAguaEncanada: formData.get("temAguaEncanada") === "on",
      temEsgoto: formData.get("temEsgoto") === "on",
      temEnergia: formData.get("temEnergia") === "on",
      nis: (formData.get("nis") as string) || null,
      temBeneficios: formData.get("temBeneficios") === "on",
      descricaoBeneficios: (formData.get("descricaoBeneficios") as string) || null,
    },
    update: {
      tipoImovel: tipoImovel ? (tipoImovel as "PROPRIO" | "ALUGADO" | "CEDIDO" | "OUTRO") : null,
      tipoImovelOutro: (formData.get("tipoImovelOutro") as string) || null,
      valorAluguel: formData.get("valorAluguel") ? parseInt(formData.get("valorAluguel") as string) : null,
      temAguaEncanada: formData.get("temAguaEncanada") === "on",
      temEsgoto: formData.get("temEsgoto") === "on",
      temEnergia: formData.get("temEnergia") === "on",
      nis: (formData.get("nis") as string) || null,
      temBeneficios: formData.get("temBeneficios") === "on",
      descricaoBeneficios: (formData.get("descricaoBeneficios") as string) || null,
    },
  });
  redirect(`/participantes/${participanteId}`);
}

export async function updateFiliacao(participanteId: string, formData: FormData) {
  await requireProfile("GESTOR");
  await prisma.filiacaoParticipante.upsert({
    where: { participanteId },
    create: {
      participanteId,
      nomeMae: (formData.get("nomeMae") as string) || null,
      telefoneMae: (formData.get("telefoneMae") as string) || null,
      trabalhoMae: (formData.get("trabalhoMae") as string) || null,
      nomePai: (formData.get("nomePai") as string) || null,
      telefonePai: (formData.get("telefonePai") as string) || null,
      trabalhoPai: (formData.get("trabalhoPai") as string) || null,
    },
    update: {
      nomeMae: (formData.get("nomeMae") as string) || null,
      telefoneMae: (formData.get("telefoneMae") as string) || null,
      trabalhoMae: (formData.get("trabalhoMae") as string) || null,
      nomePai: (formData.get("nomePai") as string) || null,
      telefonePai: (formData.get("telefonePai") as string) || null,
      trabalhoPai: (formData.get("trabalhoPai") as string) || null,
    },
  });
  redirect(`/participantes/${participanteId}`);
}

export async function updateAutorizacao(participanteId: string, formData: FormData) {
  await requireProfile("GESTOR");
  await prisma.autorizacaoParticipante.upsert({
    where: { participanteId },
    create: {
      participanteId,
      podeSairSozinho: formData.get("podeSairSozinho") === "on",
      nomeAutorizado: (formData.get("nomeAutorizado") as string) || null,
      vinculoAutorizado: (formData.get("vinculoAutorizado") as string) || null,
      telefoneAutorizado: (formData.get("telefoneAutorizado") as string) || null,
    },
    update: {
      podeSairSozinho: formData.get("podeSairSozinho") === "on",
      nomeAutorizado: (formData.get("nomeAutorizado") as string) || null,
      vinculoAutorizado: (formData.get("vinculoAutorizado") as string) || null,
      telefoneAutorizado: (formData.get("telefoneAutorizado") as string) || null,
    },
  });
  redirect(`/participantes/${participanteId}`);
}

export async function updateObservacao(participanteId: string, formData: FormData) {
  await requireProfile("GESTOR");
  await prisma.observacaoParticipante.upsert({
    where: { participanteId },
    create: {
      participanteId,
      notas: (formData.get("notas") as string) || null,
    },
    update: {
      notas: (formData.get("notas") as string) || null,
    },
  });
  redirect(`/participantes/${participanteId}`);
}

export async function addResponsavel(participanteId: string, formData: FormData) {
  await requireProfile("GESTOR");
  await prisma.responsavelParticipante.create({
    data: {
      participanteId,
      nome: (formData.get("nome") as string) || null,
      parentesco: (formData.get("parentesco") as string) || null,
      telefone: (formData.get("telefone") as string) || null,
      trabalho: (formData.get("trabalho") as string) || null,
      endereco: (formData.get("endereco") as string) || null,
    },
  });
  redirect(`/participantes/${participanteId}`);
}

export async function removeResponsavel(id: string, participanteId: string) {
  await requireProfile("GESTOR");
  await prisma.responsavelParticipante.delete({ where: { id } });
  redirect(`/participantes/${participanteId}`);
}

export async function addMembroFamiliar(participanteId: string, formData: FormData) {
  await requireProfile("GESTOR");
  await prisma.membroFamiliar.create({
    data: {
      participanteId,
      nome: formData.get("nome") as string,
      parentesco: (formData.get("parentesco") as string) || null,
      idade: formData.get("idade") ? parseInt(formData.get("idade") as string) : null,
      profissao: (formData.get("profissao") as string) || null,
      renda: formData.get("renda") ? parseInt(formData.get("renda") as string) : null,
    },
  });
  redirect(`/participantes/${participanteId}`);
}

export async function removeMembroFamiliar(id: string, participanteId: string) {
  await requireProfile("GESTOR");
  await prisma.membroFamiliar.delete({ where: { id } });
  redirect(`/participantes/${participanteId}`);
}
