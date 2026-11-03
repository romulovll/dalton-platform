import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const GOOGLE_CLIENT_ID = "20602711487-bva0pusuou57sg2pg7o3hfbrjvaogo65.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const PUBLIC_ORIGIN = "https://dalton-web-20602711487.southamerica-east1.run.app";

function redirect303(path: string) {
  return new NextResponse(null, {
    status: 303,
    headers: { Location: `${PUBLIC_ORIGIN}${path}` },
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const credential = formData.get("credential") as string;

    if (!credential) {
      return redirect303("/login?error=no_credential");
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return redirect303("/login?error=invalid_token");
    }

    const email = payload.email.toLowerCase();

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { unidades: { select: { perfil: true } } },
    });

    if (!usuario) {
      return redirect303(`/login?error=E-mail+${encodeURIComponent(email)}+não+cadastrado`);
    }

    if (usuario.situacao !== "ATIVO") {
      return redirect303("/login?error=Conta+desativada");
    }

    const perfilOrder = ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "PSICOLOGO", "PROFESSOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR", "CONSULTA"];
    const perfis = usuario.unidades.map((u) => u.perfil);
    const perfil = perfilOrder.find((p) => perfis.includes(p as never)) || "CONSULTA";

    await createSession({
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      perfil,
    });

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { tentativasLogin: 0, bloqueadoAte: null, situacao: "ATIVO", primeiroAcesso: false },
    });

    console.log(`[GOOGLE REDIRECT] Login OK: ${email} as ${perfil}`);
    return redirect303("/painel");
  } catch (err) {
    console.error("[GOOGLE REDIRECT]", err instanceof Error ? err.message : err);
    return redirect303("/login?error=Erro+na+autenticação");
  }
}
