"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedWrapper } from "./animated-wrapper";

export function CtaSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <AnimatedWrapper>
          <div className="relative rounded-3xl bg-gradient-to-br from-verde-escuro/5 to-verde-claro/10 border border-verde-claro/20 p-12 sm:p-16 text-center overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-verde-claro/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-verde-escuro/5 blur-3xl" />

            <div className="relative">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-texto-escuro leading-tight">
                Pronto para modernizar a{" "}
                <span className="text-verde-escuro">
                  gestão do patrimônio
                </span>
                ?
              </h2>

              <p className="mt-4 text-lg text-cinza-escuro max-w-xl mx-auto">
                Acesse o sistema e comece a cadastrar os bens do Instituto
                Dalton Salomão. Conformidade legal, transparência e controle
                em uma só plataforma.
              </p>

              <div className="mt-8">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 rounded-xl bg-verde-escuro px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-verde-medio hover:shadow-xl hover:scale-105"
                >
                  Acessar Sistema
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <p className="mt-6 text-sm text-cinza-medio">
                Dúvidas?{" "}
                <a
                  href="#contato"
                  className="text-verde-medio underline hover:text-verde-escuro"
                >
                  Entre em contato conosco
                </a>
              </p>
            </div>
          </div>
        </AnimatedWrapper>
      </div>
    </section>
  );
}
