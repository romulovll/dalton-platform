export const dynamic = "force-dynamic";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, ExternalLink } from "lucide-react";
import { getDocumentos } from "@/lib/actions/documentos";

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

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DocumentosPage() {
  const documentos = await getDocumentos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Documentos</h1>
          <p className="text-cinza-medio mt-1">
            Gerencie os documentos do Portal de Transparência
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/transparencia" target="_blank" className={cn(buttonVariants({ variant: "outline" }))}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Portal Público
          </Link>
          <Link
            href="/documentos/novo"
            className={cn(buttonVariants({ variant: "default" }), "bg-verde-escuro hover:bg-verde-medio")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Documento
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-verde-medio" />
            {documentos.length} documento{documentos.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documentos.length === 0 ? (
            <div className="text-center py-8 text-cinza-medio">
              Nenhum documento cadastrado.{" "}
              <Link href="/documentos/novo" className="text-verde-medio underline">
                Adicionar o primeiro
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ano</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Publicado</TableHead>
                  <TableHead>Enviado por</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentos.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-mono text-sm font-semibold">{doc.ano}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {catLabels[doc.categoria] || doc.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{doc.titulo}</TableCell>
                    <TableCell className="text-sm">
                      <a href={doc.arquivoUrl} target="_blank" rel="noopener noreferrer" className="text-verde-escuro hover:underline">
                        {doc.nomeArquivo}
                      </a>
                    </TableCell>
                    <TableCell className="text-sm text-cinza-medio">{formatSize(doc.tamanho)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={doc.publicado ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {doc.publicado ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{doc.usuario.nome}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
