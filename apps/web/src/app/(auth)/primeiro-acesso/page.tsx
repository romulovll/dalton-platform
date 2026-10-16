"use client";

import { useActionState } from "react";
import Image from "next/image";
import { changePasswordAction } from "@/lib/actions/auth";

export default function PrimeiroAcessoPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return changePasswordAction(formData);
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-cinza-claro">
      <div className="w-full max-w-md mx-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <Image src="/logo_dalton.jpeg" alt="Instituto Dalton Salomão"
              width={80} height={80} className="mx-auto rounded-xl mb-4" />
            <h1 className="font-heading text-2xl font-bold text-texto-escuro">
              Primeiro Acesso
            </h1>
            <p className="text-sm text-cinza-medio mt-1">
              Por segurança, você deve trocar sua senha temporária
            </p>
          </div>

          <div className="mb-4 rounded-lg bg-amarelo/10 border border-amarelo/20 px-4 py-3 text-sm text-cinza-escuro">
            Defina uma nova senha com no mínimo 8 caracteres, contendo letras e números.
          </div>

          {state?.error && (
            <div className="mb-4 rounded-lg bg-vermelho/10 border border-vermelho/20 px-4 py-3 text-sm text-vermelho">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="senha_atual" className="block text-sm font-medium text-cinza-escuro mb-1.5">
                Senha atual (temporária)
              </label>
              <input type="password" id="senha_atual" name="senha_atual" required
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-texto-escuro placeholder:text-cinza-medio focus:border-verde-medio focus:ring-2 focus:ring-verde-medio/20 outline-none transition-all" />
            </div>

            <div>
              <label htmlFor="nova_senha" className="block text-sm font-medium text-cinza-escuro mb-1.5">
                Nova senha
              </label>
              <input type="password" id="nova_senha" name="nova_senha" required minLength={8}
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-texto-escuro placeholder:text-cinza-medio focus:border-verde-medio focus:ring-2 focus:ring-verde-medio/20 outline-none transition-all" />
            </div>

            <div>
              <label htmlFor="confirmar_senha" className="block text-sm font-medium text-cinza-escuro mb-1.5">
                Confirmar nova senha
              </label>
              <input type="password" id="confirmar_senha" name="confirmar_senha" required minLength={8}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-texto-escuro placeholder:text-cinza-medio focus:border-verde-medio focus:ring-2 focus:ring-verde-medio/20 outline-none transition-all" />
            </div>

            <button type="submit" disabled={isPending}
              className="w-full rounded-lg bg-verde-escuro px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-verde-medio disabled:opacity-50">
              {isPending ? "Alterando..." : "Alterar Senha e Continuar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
