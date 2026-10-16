"use client";

import {
  Package,
  Building2,
  QrCode,
  TrendingDown,
  ClipboardCheck,
  FileText,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "./animated-wrapper";

const features = [
  {
    icon: Package,
    title: "Cadastro de Bens",
    description:
      "Registre cada bem com tombamento único, foto, localização, responsável e histórico completo. Categorias e tipos de item personalizáveis.",
  },
  {
    icon: Building2,
    title: "Multi-Unidade",
    description:
      "Gerencie todas as unidades do Instituto em um só lugar. Visão consolidada, por unidade ou por cidade. Mesmo CNPJ, controle centralizado.",
  },
  {
    icon: QrCode,
    title: "QR Code e Etiquetas",
    description:
      "Gere etiquetas com QR Code para identificação rápida. Leitura pelo celular durante o inventário. Tombamento fixo e imutável.",
  },
  {
    icon: TrendingDown,
    title: "Controle de Depreciação",
    description:
      "Cálculo automático de depreciação conforme IN RFB 1.700/2017 e ITG 2002. Taxas por categoria, vida útil e valor residual.",
  },
  {
    icon: ClipboardCheck,
    title: "Inventário Digital",
    description:
      "Conferência física com QR Code, registro de divergências e relatório automático. Inventário por unidade, setor ou geral.",
  },
  {
    icon: FileText,
    title: "Prestação de Contas",
    description:
      "Relatórios prontos para o Tribunal de Contas conforme Lei 13.019/2014. Exportação em PDF e Excel. Bens remanescentes e parcerias.",
  },
];

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="py-24 bg-cinza-claro">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-verde-medio" />
            <span className="text-sm font-semibold tracking-widest text-verde-medio uppercase">
              Funcionalidades
            </span>
            <div className="h-px w-10 bg-verde-medio" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-texto-escuro">
            Tudo o que você precisa para{" "}
            <span className="text-verde-escuro">gerenciar o patrimônio</span>
          </h2>
          <p className="mt-4 text-lg text-cinza-escuro max-w-2xl mx-auto">
            Do cadastro à prestação de contas, em uma plataforma única e
            integrada.
          </p>
        </div>

        {/* Feature cards grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group rounded-2xl bg-white p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                <div className="inline-flex rounded-xl bg-verde-escuro/5 p-3 mb-5">
                  <feature.icon className="h-7 w-7 text-verde-escuro transition-colors group-hover:text-verde-medio" />
                </div>
                <h3 className="text-xl font-bold text-texto-escuro mb-3">
                  {feature.title}
                </h3>
                <p className="text-cinza-escuro leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
