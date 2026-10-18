export const dynamic = "force-dynamic";

import Link from "next/link";
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
import { ShieldCheck } from "lucide-react";
import { getAuditLogs } from "@/lib/actions/audit";

const acaoStyle: Record<string, string> = {
  CREATE: "bg-green-100 text-green-800",
  UPDATE: "bg-blue-100 text-blue-800",
  DELETE: "bg-red-100 text-red-800",
};

const acaoLabel: Record<string, string> = {
  CREATE: "Criação",
  UPDATE: "Alteração",
  DELETE: "Exclusão",
};

const entidadeLabel: Record<string, string> = {
  Bem: "Bem Patrimonial",
  Unidade: "Unidade",
  Movimentacao: "Movimentação",
  Usuario: "Usuário",
  Parceria: "Parceria",
  Inventario: "Inventário",
};

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ entidade?: string; acao?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const { logs, total, totalPages } = await getAuditLogs({
    entidade: params.entidade,
    acao: params.acao,
    page,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-texto-escuro">Auditoria</h1>
        <p className="text-cinza-medio mt-1">
          Registro de todas as ações realizadas no sistema
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/auditoria"
          className={`px-3 py-1 rounded-full text-sm ${!params.entidade && !params.acao ? "bg-verde-escuro text-white" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          Todos
        </Link>
        {Object.entries(entidadeLabel).map(([key, label]) => (
          <Link
            key={key}
            href={`/auditoria?entidade=${key}`}
            className={`px-3 py-1 rounded-full text-sm ${params.entidade === key ? "bg-verde-escuro text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-verde-medio" />
            {total} registro{total !== 1 ? "s" : ""} de auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-cinza-medio">
              Nenhum registro de auditoria encontrado.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Entidade</TableHead>
                      <TableHead>Bem</TableHead>
                      <TableHead>Detalhes</TableHead>
                      <TableHead>Usuário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => {
                      const dados = log.dados as Record<string, unknown> | null;
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm whitespace-nowrap">
                            {log.createdAt.toLocaleString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={acaoStyle[log.acao] || ""}>
                              {acaoLabel[log.acao] || log.acao}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {entidadeLabel[log.entidade] || log.entidade}
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {log.bem ? (
                              <Link href={`/bens/${log.bem.tombamento}`} className="text-verde-escuro hover:underline">
                                {log.bem.tombamento}
                              </Link>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="text-sm max-w-xs truncate">
                            {dados
                              ? Object.entries(dados)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(", ")
                              : "—"}
                          </TableCell>
                          <TableCell className="text-sm">{log.usuario.nome}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {page > 1 && (
                    <Link
                      href={`/auditoria?${params.entidade ? `entidade=${params.entidade}&` : ""}page=${page - 1}`}
                      className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                      Anterior
                    </Link>
                  )}
                  <span className="text-sm text-cinza-medio">
                    Página {page} de {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/auditoria?${params.entidade ? `entidade=${params.entidade}&` : ""}page=${page + 1}`}
                      className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                      Próxima
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
