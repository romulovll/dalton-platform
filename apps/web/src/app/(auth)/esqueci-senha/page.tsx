"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth";

export default function EsqueciSenhaPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return forgotPasswordAction(formData);
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-cinza-claro">
      <div className="w-full max-w-md mx-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image src="/logo_dalton.jpeg" alt="Instituto Dalton Salomão"
                width={80} height={80} className="mx-auto rounded-xl mb-4" />
            </Link>
            <h1 className="font-heading text-2xl font-bold text-texto-escuro">
              Esqueci minha senha
            </h1>
            <p className="text-sm text-cinza-medio mt-1">
              Informe seu e-mail para receber o link de redefinição
            </p>
          </div>

          {state?.success ? (
            <div className="rounded-lg bg-verde-escuro/10 border border-verde-escuro/20 px-4 py-6 text-center">
              <p className="text-sm text-verde-escuro font-medium">
                Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.
              </p>
              <p className="text-xs text-cinza-medio mt-2">
                O link é válido por 2 horas.
              </p>
              <Link href="/login" className="inline-block mt-4 text-sm text-verde-medio hover:underline">
                Voltar ao login
              </Link>
            </div>
          ) : (
            <>
              {state?.error && (
                <div className="mb-4 rounded-lg bg-vermelho/10 border border-vermelho/20 px-4 py-3 text-sm text-vermelho">
                  {state.error}
                </div>
              )}

              <form action={formAction} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-cinza-escuro mb-1.5">
                    E-mail
                  </label>
                  <input type="email" id="email" name="email" placeholder="seu@email.com" required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-texto-escuro placeholder:text-cinza-medio focus:border-verde-medio focus:ring-2 focus:ring-verde-medio/20 outline-none transition-all" />
                </div>

                <button type="submit" disabled={isPending}
                  className="w-full rounded-lg bg-verde-escuro px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-verde-medio disabled:opacity-50">
                  {isPending ? "Enviando..." : "Enviar link de redefinição"}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-cinza-medio hover:text-verde-medio transition-colors">
              ← Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
