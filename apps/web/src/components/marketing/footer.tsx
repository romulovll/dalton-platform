import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const quickLinks = [
  { label: "Sobre", href: "#sobre" },
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Acessar Sistema", href: "/login" },
];

export function Footer() {
  return (
    <footer id="contato" className="bg-texto-escuro">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Logo & slogan */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo_dalton.jpeg"
                alt="Instituto Dalton Salomão"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div>
                <p className="font-heading text-lg font-bold text-white">
                  Instituto Dalton Salomão
                </p>
              </div>
            </div>
            <p className="text-white/50 italic text-sm mt-2">
              &ldquo;Futuro se faz com amor&rdquo;
            </p>
            <p className="text-white/40 text-sm mt-4 leading-relaxed">
              Organização sem fins lucrativos dedicada à educação, cultura e
              desenvolvimento social.
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("#") ? (
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-verde-claro transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-verde-claro transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contato
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-verde-claro flex-shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">
                  Presidente Epitácio — SP
                  <br />
                  Brasil
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-verde-claro flex-shrink-0" />
                <span className="text-white/60 text-sm">(18) 2016-0104</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-verde-claro flex-shrink-0" />
                <span className="text-white/60 text-sm">
                  contato@institutodalton.org.br
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">
              &copy; 2026 Instituto Dalton Salomão. Todos os direitos
              reservados.
            </p>
            <p className="text-white/30 text-xs italic">
              Feito com amor para quem constrói o futuro
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
