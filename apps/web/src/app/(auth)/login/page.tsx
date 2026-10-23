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
      <Script src="https://accounts.google.com/gsi/client?hl=pt-BR" strategy="afterInteractive" />

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

          {/* Google Sign-In — custom button to avoid Chinese locale issue */}
          <div className="mb-4">
            <div
              id="g_id_onload"
              data-client_id={GOOGLE_CLIENT_ID}
              data-callback="handleGoogleSignIn"
              data-auto_prompt="false"
            />
            <button
              type="button"
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const google = (window as any).google;
                if (google?.accounts?.id) {
                  google.accounts.id.prompt();
                }
              }}
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9.003 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
              </svg>
              Entrar com Google
            </button>
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
