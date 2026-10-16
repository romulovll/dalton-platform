import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instituto Dalton Salomão — Gestão Patrimonial",
  description:
    "Sistema de controle patrimonial e inventário do Instituto Dalton Salomão. Gestão inteligente de bens para todas as unidades.",
  keywords: [
    "Instituto Dalton Salomão",
    "gestão patrimonial",
    "inventário",
    "controle de bens",
    "organização sem fins lucrativos",
    "Presidente Epitácio",
  ],
  openGraph: {
    title: "Instituto Dalton Salomão — Sistema de Gestão Patrimonial",
    description:
      "Gestão inteligente do patrimônio que constrói o futuro. Controle completo dos bens patrimoniais em todas as unidades.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
