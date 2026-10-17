"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { requireProfile } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";
import { CategoriaDocumento } from "@prisma/client";

export async function createDocumento(formData: FormData) {
  await requireProfile("ADMIN_GERAL");
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  const doc = await prisma.documento.create({
    data: {
      titulo: formData.get("titulo") as string,
      descricao: (formData.get("descricao") as string) || null,
      categoria: formData.get("categoria") as CategoriaDocumento,
      ano: parseInt(formData.get("ano") as string),
      arquivoUrl: formData.get("arquivo_url") as string,
      nomeArquivo: formData.get("nome_arquivo") as string,
      tamanho: parseInt(formData.get("tamanho") as string) || 0,
      publicado: formData.get("publicado") !== "off",
      usuarioId: session.userId,
    },
  });

  await logAudit({
    acao: "CREATE",
    entidade: "Documento",
    entidadeId: doc.id,
    dados: { titulo: doc.titulo, ano: doc.ano, categoria: doc.categoria },
  });

  redirect("/documentos");
}

export async function deleteDocumento(id: string) {
  await requireProfile("ADMIN_GERAL");

  await prisma.documento.delete({ where: { id } });

  await logAudit({
    acao: "DELETE",
    entidade: "Documento",
    entidadeId: id,
  });

  redirect("/documentos");
}

export async function getDocumentos() {
  return prisma.documento.findMany({
    orderBy: [{ ano: "desc" }, { createdAt: "desc" }],
    include: { usuario: { select: { nome: true } } },
  });
}

export async function getDocumentosPublicos() {
  return prisma.documento.findMany({
    where: { publicado: true },
    orderBy: [{ ano: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      titulo: true,
      descricao: true,
      categoria: true,
      ano: true,
      arquivoUrl: true,
      nomeArquivo: true,
      tamanho: true,
      createdAt: true,
    },
  });
}
