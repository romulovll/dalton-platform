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
import { Plus, MessageSquareWarning } from "lucide-react";
import { getChamados } from "@/lib/actions/chamados";

const tipoConfig: Record<string, { label: string; className: string }> = {
  ERRO: { label: "Erro", className: "bg-red-100 text-red-800" },
  AJUSTE: { label: "Ajuste", className: "bg-blue-100 text-blue-800" },
  DUVIDA: { label: "Dúvida", className: "bg-purple-100 text-purple-800" },
  SUGESTAO: { label: "Sugestão", className: "bg-green-100 text-green-800" },
};

const prioridadeConfig: Record<string, { label: string; className: string }> = {
  BAIXA: { label: "Baixa", className: "bg-gray-100 text-gray-800" },
  MEDIA: { label: "Média", className: "bg-yellow-100 text-yellow-800" },
  ALTA: { label: "Alta", className: "bg-orange-100 text-orange-800" },
  URGENTE: { label: "Urgente", className: "bg-red-100 text-red-800" },
};

const situacaoConfig: Record<string, { label: string; className: string }> = {
  ABERTO: { label: "Aberto", className: "bg-blue-100 text-blue-800" },
  EM_ANDAMENTO: { label: "Em Andamento", className: "bg-yellow-100 text-yellow-800" },
  RESOLVIDO: { label: "Resolvido", className: "bg-green-100 text-green-800" },
  FECHADO: { label: "Fechado", className: "bg-gray-100 text-gray-800" },
};

export default async function ChamadosPage({
  searchParams,
}: {
  searchParams: Promise<{ situacao?: string }>;
}) {
  const params = await searchParams;
  const chamados = await getChamados({ situacao: params.situacao });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Chamados</h1>
          <p className="text-cinza-medio mt-1">
            Relate erros, solicite ajustes ou envie sugestões
          </p>
        </div>
        <Link
          href="/chamados/novo"
          className={cn(buttonVariants({ variant: "default" }), "bg-verde-escuro hover:bg-verde-medio")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Chamado
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap overflow-visible">
        <Link
          href="/chamados"
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${!params.situacao ? "bg-verde-escuro text-white" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          Todos
        </Link>
        {Object.entries(situacaoConfig).map(([key, config]) => (
          <Link
            key={key}
            href={`/chamados?situacao=${key}`}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${params.situacao === key ? "bg-verde-escuro text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            {config.label}
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquareWarning className="h-5 w-5 text-verde-medio" />
            {chamados.length} chamado{chamados.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chamados.length === 0 ? (
            <div className="text-center py-8 text-cinza-medio">
              Nenhum chamado registrado.{" "}
              <Link href="/chamados/novo" className="text-verde-medio underline">
                Abrir o primeiro
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Aberto por</TableHead>
                    <TableHead>Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chamados.map((c) => {
                    const tipo = tipoConfig[c.tipo];
                    const prio = prioridadeConfig[c.prioridade];
                    const sit = situacaoConfig[c.situacao];
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="text-sm whitespace-nowrap">
                          {c.createdAt.toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={tipo.className}>{tipo.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={prio.className}>{prio.label}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <Link href={`/chamados/${c.id}`} className="text-verde-escuro hover:underline">
                            {c.titulo}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">{c.usuario.nome}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={sit.className}>{sit.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
