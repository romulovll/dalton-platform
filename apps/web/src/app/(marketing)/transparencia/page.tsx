export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ArrowLeft, ShieldCheck } from "lucide-react";
import { getDocumentosPublicos } from "@/lib/actions/documentos";
import { prisma } from "@/lib/prisma";

const catLabels: Record<string, string> = {
  BALANCO: "Balanço Patrimonial",
  PRESTACAO_CONTAS: "Prestação de Contas",
  ATA: "Ata",
  ESTATUTO: "Estatuto",
  RELATORIO_ATIVIDADES: "Relatório de Atividades",
  PARECER_FISCAL: "Parecer do Conselho Fiscal",
  CERTIDAO: "Certidão",
  CONTRATO_PARCERIA: "Contrato/Parceria",
  OUTRO: "Outro",
};

const catColors: Record<string, string> = {
  BALANCO: "bg-blue-100 text-blue-800",
  PRESTACAO_CONTAS: "bg-green-100 text-green-800",
  ATA: "bg-purple-100 text-purple-800",
  ESTATUTO: "bg-orange-100 text-orange-800",
  RELATORIO_ATIVIDADES: "bg-yellow-100 text-yellow-800",
  PARECER_FISCAL: "bg-indigo-100 text-indigo-800",
  CERTIDAO: "bg-gray-100 text-gray-800",
  CONTRATO_PARCERIA: "bg-red-100 text-red-800",
  OUTRO: "bg-gray-100 text-gray-800",
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function TransparenciaPage() {
  const [documentos, org] = await Promise.all([
    getDocumentosPublicos(),
    prisma.organizacao.findFirst(),
  ]);

  // Group by year
  const byYear = new Map<number, typeof documentos>();
  for (const doc of documentos) {
    const list = byYear.get(doc.ano) || [];
    list.push(doc);
    byYear.set(doc.ano, list);
  }
  const years = Array.from(byYear.keys()).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-verde-escuro text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>
          <div className="flex items-center gap-4">
            <Image
              src="/logo_dalton.jpeg"
              alt="Instituto Dalton Salomão"
              width={64}
              height={64}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-3xl font-bold">Portal de Transparência</h1>
              <p className="text-white/80 mt-1">
                {org?.nome || "Instituto Dalton Salomão"} — Prestação de contas pública
              </p>
              {org?.cnpj && <p className="text-white/60 text-sm mt-1">CNPJ: {org.cnpj}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Legal notice */}
        <div className="flex items-start gap-3 rounded-lg border border-verde-escuro/20 bg-verde-escuro/5 p-4">
          <ShieldCheck className="h-5 w-5 text-verde-escuro mt-0.5 flex-shrink-0" />
          <div className="text-sm text-verde-escuro">
            <p className="font-medium">Compromisso com a transparência</p>
            <p className="mt-1 text-verde-escuro/80">
              Em conformidade com a Lei 13.019/2014 (Marco Regulatório das OSCs),
              Lei 9.790/1999 (OSCIPs) e ITG 2002 (R1), disponibilizamos publicamente
              os documentos de prestação de contas e governança institucional.
            </p>
          </div>
        </div>

        {years.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-cinza-medio">
              <FileText className="mx-auto h-12 w-12 text-cinza-medio/50 mb-4" />
              <p>Nenhum documento publicado ainda.</p>
            </CardContent>
          </Card>
        ) : (
          years.map((year) => {
            const docs = byYear.get(year)!;
            return (
              <Card key={year}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-verde-medio" />
                    {year}
                    <Badge variant="secondary" className="ml-2 bg-gray-100">
                      {docs.length} documento{docs.length !== 1 ? "s" : ""}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {docs.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.arquivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 group"
                      >
                        <div className="rounded-lg bg-verde-escuro/10 p-3 flex-shrink-0">
                          <FileText className="h-6 w-6 text-verde-escuro" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-texto-escuro group-hover:text-verde-escuro">
                            {doc.titulo}
                          </p>
                          {doc.descricao && (
                            <p className="text-sm text-cinza-medio mt-0.5">{doc.descricao}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="secondary" className={catColors[doc.categoria] || "bg-gray-100"}>
                              {catLabels[doc.categoria] || doc.categoria}
                            </Badge>
                            <span className="text-xs text-cinza-medio">{formatSize(doc.tamanho)}</span>
                            <span className="text-xs text-cinza-medio">
                              {doc.createdAt.toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                        <Download className="h-5 w-5 text-cinza-medio group-hover:text-verde-escuro flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-cinza-medio">
          Dúvidas sobre os documentos? Entre em contato pelo e-mail do Instituto ou abra um chamado no sistema.
        </p>
      </div>
    </div>
  );
}
