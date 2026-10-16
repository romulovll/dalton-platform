"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession, getSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const senha = formData.get("password") as string;

  if (!email || !senha) {
    return { error: "E-mail e senha são obrigatórios." };
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { unidades: { select: { perfil: true } } },
  });

  if (!usuario) {
    return { error: "E-mail ou senha incorretos." };
  }

  // Check if blocked
  if (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date()) {
    return {
      error: "Conta bloqueada temporariamente. Tente novamente mais tarde.",
    };
  }

  // Check if inactive
  if (usuario.situacao === "INATIVO") {
    return { error: "Conta desativada. Entre em contato com o administrador." };
  }

  // Verify password
  const senhaCorreta = await compare(senha, usuario.senhaHash);

  if (!senhaCorreta) {
    // Increment failed attempts
    const tentativas = usuario.tentativasLogin + 1;
    const updates: Record<string, unknown> = { tentativasLogin: tentativas };

    // Block after 5 failed attempts (15 min)
    if (tentativas >= 5) {
      updates.bloqueadoAte = new Date(Date.now() + 15 * 60 * 1000);
      updates.situacao = "BLOQUEADO";
    }

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: updates,
    });

    if (tentativas >= 5) {
      return {
        error: "Conta bloqueada por 15 minutos após 5 tentativas incorretas.",
      };
    }

    return { error: "E-mail ou senha incorretos." };
  }

  // Reset failed attempts on successful login
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      tentativasLogin: 0,
      bloqueadoAte: null,
      situacao: "ATIVO",
    },
  });

  // Determine highest access profile
  const perfilOrder = ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR", "CONSULTA"];
  const perfis = usuario.unidades.map((u) => u.perfil);
  const perfil = perfilOrder.find((p) => perfis.includes(p as never)) || "CONSULTA";

  // Create session
  await createSession({
    userId: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
    perfil,
  });

  // Redirect to password change if first access
  if (usuario.primeiroAcesso) {
    redirect("/primeiro-acesso");
  }

  redirect("/painel");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  if (!email) return { error: "E-mail é obrigatório." };

  // Always return success to prevent email enumeration
  // Password reset is not yet implemented — admin must reset manually
  return {
    success: true,
    message: "Se o e-mail estiver cadastrado, entre em contato com o administrador para redefinir sua senha.",
  };
}

export async function changePasswordAction(formData: FormData) {
  const senhaAtual = formData.get("senha_atual") as string;
  const novaSenha = formData.get("nova_senha") as string;
  const confirmar = formData.get("confirmar_senha") as string;

  if (!novaSenha || novaSenha.length < 8) {
    return { error: "A nova senha deve ter no mínimo 8 caracteres." };
  }

  if (novaSenha !== confirmar) {
    return { error: "As senhas não conferem." };
  }

  const session = await getSession();
  if (!session) return { error: "Sessão expirada." };

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.userId },
  });
  if (!usuario) return { error: "Usuário não encontrado." };

  const senhaCorreta = await compare(senhaAtual, usuario.senhaHash);
  if (!senhaCorreta) return { error: "Senha atual incorreta." };

  const novaSenhaHash = await hash(novaSenha, 12);
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { senhaHash: novaSenhaHash, primeiroAcesso: false },
  });

  redirect("/painel");
}
