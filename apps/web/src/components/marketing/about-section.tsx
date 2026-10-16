"use client";

import Image from "next/image";
import { AnimatedWrapper } from "./animated-wrapper";
import { MapPin, Building2, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Building2, value: "Multi-Unidade", label: "Gestão Centralizada" },
  { icon: MapPin, value: "Várias Cidades", label: "Interior de SP" },
  { icon: ShieldCheck, value: "100%", label: "Transparência" },
];

export function AboutSection() {
  return (
    <section id="sobre" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text column */}
          <AnimatedWrapper direction="left">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-verde-medio" />
                <span className="text-sm font-semibold tracking-widest text-verde-medio uppercase">
                  Sobre Nós
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-texto-escuro leading-tight">
                Futuro se faz{" "}
                <span className="text-verde-escuro">com amor</span>
              </h2>

              <p className="mt-6 text-lg text-cinza-escuro leading-relaxed">
                O Instituto Dalton Salomão é uma organização sem fins lucrativos
                que atua em diversas cidades do interior de São Paulo, levando
                educação, cultura e desenvolvimento social para comunidades que
                mais precisam.
              </p>

              <p className="mt-4 text-lg text-cinza-escuro leading-relaxed">
                Com transparência e compromisso, cada bem adquirido é
                registrado, rastreado e cuidado — porque o futuro se constrói
                com responsabilidade e prestação de contas à sociedade.
              </p>

              <p className="mt-4 text-lg text-cinza-escuro leading-relaxed">
                Nosso sistema de gestão patrimonial garante conformidade com a
                legislação brasileira, incluindo a Lei 13.019/2014 (Marco
                Regulatório das OSCs) e as normas contábeis do CFC.
              </p>

              {/* Mini stats */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-verde-claro/30 bg-verde-claro/5 p-4 text-center"
                  >
                    <stat.icon className="mx-auto h-6 w-6 text-verde-medio mb-2" />
                    <p className="text-lg font-bold text-verde-escuro">
                      {stat.value}
                    </p>
                    <p className="text-xs text-cinza-medio mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedWrapper>

          {/* Logo / visual column */}
          <AnimatedWrapper direction="right" delay={0.2}>
            <div className="relative flex items-center justify-center">
              {/* Decorative background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-verde-claro/10 to-verde-escuro/5" />
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-verde-claro/20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-verde-escuro/10 blur-2xl" />

              <div className="relative p-12">
                <Image
                  src="/logo_dalton.jpeg"
                  alt="Logo Instituto Dalton Salomão"
                  width={400}
                  height={400}
                  className="rounded-2xl"
                  priority
                />
              </div>
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </section>
  );
}
