import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const GOOGLE_CLIENT_ID = "20602711487-bva0pusuou57sg2pg7o3hfbrjvaogo65.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();
    if (!credential) {
      return NextResponse.json({ error: "Token não fornecido." }, { status: 400 });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return NextResponse.json({ error: "Token inválido." }, { status: 400 });
    }

    const email = payload.email.toLowerCase();

    // Check if user exists in our database
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { unidades: { select: { perfil: true } } },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: `Acesso negado — o e-mail ${email} não está cadastrado no sistema. Solicite acesso ao administrador.` },
        { status: 403 }
      );
    }

    if (usuario.situacao === "INATIVO") {
      return NextResponse.json(
        { error: "Conta desativada. Entre em contato com o administrador." },
        { status: 403 }
      );
    }

    if (usuario.situacao === "BLOQUEADO") {
      return NextResponse.json(
        { error: "Conta bloqueada. Entre em contato com o administrador." },
        { status: 403 }
      );
    }

    // Determine highest profile
    const perfilOrder = ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "PROFESSOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR", "CONSULTA"];
    const perfis = usuario.unidades.map((u) => u.perfil);
    const perfil = perfilOrder.find((p) => perfis.includes(p as never)) || "CONSULTA";

    // Create session
    await createSession({
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      perfil,
    });

    // Reset failed login attempts
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { tentativasLogin: 0, bloqueadoAte: null, situacao: "ATIVO" },
    });

    return NextResponse.json({ ok: true, redirect: "/painel" });
  } catch (err) {
    console.error("[GOOGLE AUTH]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Erro na autenticação com Google. Tente novamente." },
      { status: 500 }
    );
  }
}
