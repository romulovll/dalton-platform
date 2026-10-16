import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET environment variable is required");
  return new TextEncoder().encode(secret);
}

// Only these paths are accessible without authentication
const PUBLIC_PATHS = ["/", "/login", "/esqueci-senha", "/primeiro-acesso"];

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

  // Everything else requires authentication (pages AND API routes)
  const token = request.cookies.get("dalton_session")?.value;
  if (!token) {
    // API routes return 401 JSON, pages redirect to login
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    // Invalid or expired token
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
