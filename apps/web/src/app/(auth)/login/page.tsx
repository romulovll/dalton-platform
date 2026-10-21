"use client";

import { useActionState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";

const RECAPTCHA_SITE_KEY = "6Lci9PktAAAAAPYDaJbvx7EjNAt8GtMGce6DpXcJ";
const GOOGLE_CLIENT_ID = "20602711487-bva0pusuou57sg2pg7o3hfbrjvaogo65.apps.googleusercontent.com";

declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (cb: () => void) => void;
        execute: (key: string, opts: { action: string }) => Promise<string>;
      };
    };
    handleGoogleSignIn: (response: { credential: string }) => void;
  }
}

export default function LoginPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      try {
        const token = await window.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, {
          action: "LOGIN",
        });
        formData.set("recaptcha_token", token);
      } catch { /* graceful */ }
      return loginAction(formData);
    },
    null
  );

  const [googleState, setGoogleState] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: formData.get("credential") }),
      });
      const data = await res.json();
      if (data.error) return { error: data.error };
      router.push("/painel");
      return null;
    },
    null
  );

  const handleGoogleCallback = useCallback((response: { credential: string }) => {
    const fd = new FormData();
    fd.set("credential", response.credential);
    setGoogleState(fd);
  }, [setGoogleState]);

  // Register global callback for Google Sign-In
  if (typeof window !== "undefined") {
    window.handleGoogleSignIn = handleGoogleCallback;
  }

  const error = state?.error || googleState?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-cinza-claro">
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />

      <div className="w-full max-w-md mx-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/logo_dalton.jpeg"
                alt="Instituto Dalton Salomão"
                width={80}
                height={80}
                className="mx-auto rounded-xl mb-4"
              />
            </Link>
            <h1 className="font-heading text-2xl font-bold text-texto-escuro">
              Acessar Sistema
            </h1>
            <p className="text-sm text-cinza-medio mt-1">
              Sistema de Gestão Patrimonial
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-lg bg-vermelho/10 border border-vermelho/20 px-4 py-3 text-sm text-vermelho">
              {error}
            </div>
          )}

          {/* Google Sign-In */}
          <div className="mb-4">
            <div
              id="g_id_onload"
              data-client_id={GOOGLE_CLIENT_ID}
              data-callback="handleGoogleSignIn"
              data-auto_prompt="false"
            />
            <div
              className="g_id_signin flex justify-center"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left"
              data-width="360"
            />
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-cinza-medio">ou com e-mail e senha</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form ref={formRef} action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-cinza-escuro mb-1.5"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                required
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-texto-escuro placeholder:text-cinza-medio focus:border-verde-medio focus:ring-2 focus:ring-verde-medio/20 outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-cinza-escuro mb-1.5"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-texto-escuro placeholder:text-cinza-medio focus:border-verde-medio focus:ring-2 focus:ring-verde-medio/20 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-verde-escuro px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-verde-medio disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-cinza-medio">
            <p>Acesso restrito a usuários cadastrados pelo administrador.</p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-cinza-medio hover:text-verde-medio transition-colors"
            >
              ← Voltar ao início
            </Link>
          </div>

          <p className="mt-4 text-center text-[10px] text-gray-400">
            Protegido por reCAPTCHA Enterprise
          </p>
        </div>
      </div>
    </div>
  );
}
