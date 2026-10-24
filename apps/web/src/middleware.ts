import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET environment variable is required");
  return new TextEncoder().encode(secret);
}

// Public paths — no auth required
const PUBLIC_PATHS = ["/", "/login", "/esqueci-senha", "/primeiro-acesso", "/transparencia", "/api/auth/google"];

// Route access by profile — which paths each role can access
// If a path is not listed, only ADMIN_GERAL and ADMIN_UNIDADE can access it
const ROUTE_ACCESS: Record<string, string[]> = {
  // Everyone can access
  "/painel": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "PROFESSOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR", "CONSULTA"],
  "/api/logout": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "PROFESSOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR", "CONSULTA"],
  "/chamados": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "PROFESSOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR", "CONSULTA"],

  // Patrimônio — no professors or consulta
  "/bens": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR"],
  "/unidades": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR"],
  "/categorias": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR"],
  "/movimentacoes": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR"],
  "/parcerias": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR"],
  "/inventarios": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR"],

  // Social — admins, gestors, professors
  "/participantes": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "PROFESSOR"],
  "/atividades": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "PROFESSOR"],
  "/presenca": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "PROFESSOR"],

  // Reports & financials
  "/relatorios": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "CONTADOR", "AUDITOR"],
  "/api/relatorio-csv": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "CONTADOR", "AUDITOR"],
  "/api/relatorio-pdf": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "CONTADOR", "AUDITOR"],
  "/api/ficha-cadastro": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "RESPONSAVEL_SETOR"],

  // Admin only
  "/usuarios": ["ADMIN_GERAL", "ADMIN_UNIDADE"],
  "/configuracoes": ["ADMIN_GERAL", "ADMIN_UNIDADE"],
  "/auditoria": ["ADMIN_GERAL", "ADMIN_UNIDADE", "AUDITOR"],
  "/documentos": ["ADMIN_GERAL", "ADMIN_UNIDADE"],

  // APIs that need broader access
  "/api/form-data": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "CONTADOR", "AUDITOR", "RESPONSAVEL_SETOR"],
  "/api/bens-list": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "RESPONSAVEL_SETOR"],
  "/api/upload": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "RESPONSAVEL_SETOR"],
  "/api/import-bens": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR"],
  "/api/upload-documento": ["ADMIN_GERAL", "ADMIN_UNIDADE"],
  "/api/update-documento": ["ADMIN_GERAL", "ADMIN_UNIDADE"],
  "/api/etiquetas": ["ADMIN_GERAL", "ADMIN_UNIDADE", "GESTOR", "RESPONSAVEL_SETOR"],
  "/api/scan-documento": ["ADMIN_GERAL", "ADMIN_UNIDADE"],
};

function getRouteRoles(pathname: string): string[] | null {
  // Check exact match first
  if (ROUTE_ACCESS[pathname]) return ROUTE_ACCESS[pathname];

  // Check prefix match (e.g. /bens/123 matches /bens)
  for (const [route, roles] of Object.entries(ROUTE_ACCESS)) {
    if (pathname.startsWith(route + "/") || pathname === route) {
      return roles;
    }
  }

  return null; // No specific rule — default to admin only
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    pathname === "/logo_dalton.jpeg" ||
    (pathname.includes(".") && !pathname.startsWith("/api"))
  ) {
    return NextResponse.next();
  }

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // Everything else requires authentication
  const token = request.cookies.get("dalton_session")?.value;
  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const perfil = (payload.perfil as string) || "CONSULTA";

    // Check route-level authorization
    const allowedRoles = getRouteRoles(pathname);
    if (allowedRoles && !allowedRoles.includes(perfil)) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Permissão insuficiente" }, { status: 403 });
      }
      // Redirect to painel with no access
      return NextResponse.redirect(new URL("/painel", request.url));
    }

    // If no specific rule, allow only admins
    if (!allowedRoles && !["ADMIN_GERAL", "ADMIN_UNIDADE"].includes(perfil)) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Permissão insuficiente" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/painel", request.url));
    }

    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("dalton_session");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
