"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-verde-escuro via-verde-medio to-verde-escuro" />

      {/* Animated pattern overlay */}
      <div className="absolute inset-0 opacity-[0.07]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="leaf-pattern"
              x="0"
              y="0"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M60 10 C60 10 80 30 80 50 C80 70 60 80 60 80 C60 80 40 70 40 50 C40 30 60 10 60 10 Z"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M60 25 L60 70"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <path
                d="M60 40 L48 32"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <path
                d="M60 50 L72 42"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm mb-8"
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-verde-claro animate-pulse" />
          Sistema de Gestão Patrimonial
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight"
        >
          Gestão inteligente do{" "}
          <span className="text-verde-claro">patrimônio</span> que constrói o
          futuro
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-6 text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
        >
          Controle completo dos bens patrimoniais do Instituto Dalton Salomão.
          Todas as unidades, uma só plataforma. Transparência e conformidade
          legal em cada registro.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-verde-escuro shadow-lg transition-all hover:bg-verde-claro hover:text-verde-escuro hover:shadow-xl hover:scale-105"
          >
            Acessar Sistema
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/transparencia"
            className="group flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50"
          >
            <ShieldCheck size={18} />
            Portal de Transparência
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#sobre" aria-label="Rolar para baixo">
          <ChevronDown size={28} className="text-white/50 animate-bounce" />
        </a>
      </motion.div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 80 480 100 720 80C960 60 1200 20 1440 40V100H0V40Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
