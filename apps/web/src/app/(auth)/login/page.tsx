"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return loginAction(formData);
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-cinza-claro">
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
          {state?.error && (
            <div className="mb-4 rounded-lg bg-vermelho/10 border border-vermelho/20 px-4 py-3 text-sm text-vermelho">
              {state.error}
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-4">
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
            <p>Utilize as credenciais fornecidas pelo administrador.</p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-cinza-medio hover:text-verde-medio transition-colors"
            >
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
