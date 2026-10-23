"use server";

import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { PerfilAcesso, SituacaoUsuario } from "@prisma/client";
import { logAudit } from "@/lib/audit";
import { requireProfile } from "@/lib/rbac";

export async function createUser(formData: FormData) {
  await requireProfile("ADMIN_GERAL");
  const senha = formData.get("senha") as string;
  // Password is optional — if empty, user can only login via Google
  const senhaHash = senha ? await hash(senha, 12) : await hash(crypto.randomUUID(), 12);

  const usuario = await prisma.usuario.create({
    data: {
      nome: formData.get("nome") as string,
      email: (formData.get("email") as string).toLowerCase().trim(),
      senhaHash,
      cpf: (formData.get("cpf") as string) || null,
      telefone: (formData.get("telefone") as string) || null,
      primeiroAcesso: !senha, // skip password change if using Google
    },
  });

  // Assign to units with profiles
  const unidadeIds = formData.getAll("unidadeIds") as string[];
  const perfil = formData.get("perfil") as PerfilAcesso;

  for (const unidadeId of unidadeIds) {
    await prisma.usuarioUnidade.create({
      data: {
        usuarioId: usuario.id,
        unidadeId,
        perfil,
      },
    });
  }

  await logAudit({
    acao: "CREATE",
    entidade: "Usuario",
    entidadeId: usuario.id,
    dados: { nome: usuario.nome, email: usuario.email },
  });

  redirect("/usuarios");
}

export async function updateUser(id: string, formData: FormData) {
  await requireProfile("ADMIN_GERAL");
  const nome = formData.get("nome") as string;
  const email = (formData.get("email") as string).toLowerCase().trim();
  const cpf = (formData.get("cpf") as string) || null;
  const telefone = (formData.get("telefone") as string) || null;
  const situacao = (formData.get("situacao") as SituacaoUsuario) || "ATIVO";

  await prisma.usuario.update({
    where: { id },
    data: { nome, email, cpf, telefone, situacao },
  });

  // Update unit assignments
  const unidadeIds = formData.getAll("unidadeIds") as string[];
  const perfil = formData.get("perfil") as PerfilAcesso;

  // Remove old assignments and create new ones
  await prisma.usuarioUnidade.deleteMany({ where: { usuarioId: id } });
  for (const unidadeId of unidadeIds) {
    await prisma.usuarioUnidade.create({
      data: { usuarioId: id, unidadeId, perfil },
    });
  }

  await logAudit({
    acao: "UPDATE",
    entidade: "Usuario",
    entidadeId: id,
    dados: { nome, email, situacao },
  });

  redirect("/usuarios");
}

export async function getUsuario(id: string) {
  return prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      cpf: true,
      telefone: true,
      situacao: true,
      unidades: {
        include: { unidade: { select: { id: true, nome: true } } },
      },
    },
  });
}

export async function getUsuarios() {
  return prisma.usuario.findMany({
    orderBy: { nome: "asc" },
    include: {
      unidades: {
        include: { unidade: { select: { id: true, nome: true } } },
      },
    },
  });
}
