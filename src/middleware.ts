import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/utils/auth";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  // Para rotas protegidas, verificar sessão completa via API
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    try {
      const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
          baseURL: request.nextUrl.origin,
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        },
      );

      if (!session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    } catch {
      // Em caso de erro, redirecionar para login
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Para páginas de auth, redirecionar se já estiver logado
  if (
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up")
  ) {
    try {
      const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
          baseURL: request.nextUrl.origin,
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        },
      );

      if (session) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      // Em caso de erro, continuar para a página de auth
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
