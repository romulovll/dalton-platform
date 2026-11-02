import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const GOOGLE_CLIENT_ID = "20602711487-bva0pusuou57sg2pg7o3hfbrjvaogo65.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      console.error("[GOOGLE CALLBACK] Token error:", tokens);
      return NextResponse.redirect(new URL("/login?error=token_failed", request.url));
    }

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userInfo = await userRes.json();
    const email = userInfo.email?.toLowerCase();

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=no_email", request.url));
    }

    // Check if user exists
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { unidades: { select: { perfil: true } } },
    });

    if (!usuario) {
      return NextResponse.redirect(new URL(`/login?error=not_registered&email=${encodeURIComponent(email)}`, request.url));
    }

    if (usuario.situacao !== "ATIVO") {
      return NextResponse.redirect(new URL("/login?error=inactive", request.url));
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

    // Reset login attempts
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { tentativasLogin: 0, bloqueadoAte: null, situacao: "ATIVO", primeiroAcesso: false },
    });

    return NextResponse.redirect(new URL("/painel", request.url));
  } catch (err) {
    console.error("[GOOGLE CALLBACK]", err instanceof Error ? err.message : err);
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }
}
