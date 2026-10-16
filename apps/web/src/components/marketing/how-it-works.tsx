"use client";

import { LogIn, PackagePlus, ArrowLeftRight, BarChart3 } from "lucide-react";
import { StaggerContainer, StaggerItem } from "./animated-wrapper";

const steps = [
  {
    icon: LogIn,
    number: "01",
    title: "Acesse o Sistema",
    description:
      "Entre com seu e-mail e senha. Acesso seguro com controle de permissões por unidade e perfil.",
  },
  {
    icon: PackagePlus,
    number: "02",
    title: "Cadastre seus Bens",
    description:
      "Registre cada bem com foto, QR Code e todas as informações exigidas por lei. Tombamento automático.",
  },
  {
    icon: ArrowLeftRight,
    number: "03",
    title: "Gerencie e Movimente",
    description:
      "Transfira entre unidades, registre manutenções, controle a depreciação e faça baixas com aprovação.",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Gere Relatórios",
    description:
      "Exporte relatórios para prestação de contas, contabilidade e auditoria. PDF e Excel prontos.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-verde-medio" />
            <span className="text-sm font-semibold tracking-widest text-verde-medio uppercase">
              Como Funciona
            </span>
            <div className="h-px w-10 bg-verde-medio" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-texto-escuro">
            Simples, rápido e{" "}
            <span className="text-verde-escuro">seguro</span>
          </h2>
        </div>

        {/* Steps */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-verde-claro/40" />

          {steps.map((step) => (
            <StaggerItem key={step.number} className="relative">
              <div className="flex flex-col items-center text-center">
                {/* Number circle */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-verde-escuro to-verde-medio shadow-lg mb-6">
                  <step.icon className="h-7 w-7 text-white" />
                </div>

                {/* Step number */}
                <span className="text-xs font-bold tracking-widest text-verde-claro uppercase mb-2">
                  Passo {step.number}
                </span>

                <h3 className="text-lg font-bold text-texto-escuro mb-3">
                  {step.title}
                </h3>

                <p className="text-cinza-escuro leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
