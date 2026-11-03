import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const GOOGLE_CLIENT_ID = "20602711487-bva0pusuou57sg2pg7o3hfbrjvaogo65.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const credential = formData.get("credential") as string;

    if (!credential) {
      return NextResponse.redirect(new URL("/login?error=no_credential", request.url));
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return NextResponse.redirect(new URL("/login?error=invalid_token", request.url));
    }

    const email = payload.email.toLowerCase();

    // Check if user exists
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { unidades: { select: { perfil: true } } },
    });

    if (!usuario) {
      return NextResponse.redirect(new URL(`/login?error=O+e-mail+${encodeURIComponent(email)}+não+está+cadastrado`, request.url));
    }

    if (usuario.situacao !== "ATIVO") {
      return NextResponse.redirect(new URL("/login?error=Conta+desativada+ou+bloqueada", request.url));
    }

    // Determine profile
    const perfilOrder = ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "PSICOLOGO", "PROFESSOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR", "CONSULTA"];
    const perfis = usuario.unidades.map((u) => u.perfil);
    const perfil = perfilOrder.find((p) => perfis.includes(p as never)) || "CONSULTA";

    // Create session
    await createSession({
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      perfil,
    });

    // Reset login state + skip primeiro_acesso for Google users
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { tentativasLogin: 0, bloqueadoAte: null, situacao: "ATIVO", primeiroAcesso: false },
    });

    return NextResponse.redirect(new URL("/painel", request.url));
  } catch (err) {
    console.error("[GOOGLE REDIRECT]", err instanceof Error ? err.message : err);
    return NextResponse.redirect(new URL("/login?error=Erro+na+autenticação", request.url));
  }
}
