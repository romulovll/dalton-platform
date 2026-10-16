"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Sobre", href: "#sobre" },
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Contato", href: "#contato" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo_dalton.jpeg"
              alt="Instituto Dalton Salomão"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div className="hidden sm:block">
              <p
                className={`font-heading text-sm font-bold transition-colors duration-300 ${
                  scrolled ? "text-verde-escuro" : "text-white"
                }`}
              >
                Instituto Dalton Salomão
              </p>
              <p
                className={`text-xs italic transition-colors duration-300 ${
                  scrolled ? "text-verde-medio" : "text-white/70"
                }`}
              >
                Futuro se faz com amor
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:opacity-80 ${
                  scrolled ? "text-cinza-escuro" : "text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                scrolled
                  ? "bg-verde-escuro text-white hover:bg-verde-medio"
                  : "border-2 border-white text-white hover:bg-white hover:text-verde-escuro"
              }`}
            >
              Acessar Sistema
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-verde-escuro" : "text-white"
            }`}
            aria-label="Menu de navegação"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100">
          <div className="px-4 py-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-cinza-escuro font-medium py-2"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className="block w-full rounded-lg bg-verde-escuro px-5 py-3 text-center text-sm font-semibold text-white hover:bg-verde-medio transition-colors"
            >
              Acessar Sistema
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
