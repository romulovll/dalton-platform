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
import { Plus, ClipboardCheck } from "lucide-react";
import { getInventarios } from "@/lib/actions/inventory";

const situacaoStyle: Record<string, { label: string; className: string }> = {
  EM_ANDAMENTO: { label: "Em Andamento", className: "bg-yellow-100 text-yellow-800" },
  CONCLUIDO: { label: "Concluído", className: "bg-green-100 text-green-800" },
  CANCELADO: { label: "Cancelado", className: "bg-red-100 text-red-800" },
};

export default async function InventariosPage() {
  const inventarios = await getInventarios();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Inventários</h1>
          <p className="text-cinza-medio mt-1">
            Levantamentos periódicos do acervo patrimonial
          </p>
        </div>
        <Link
          href="/inventarios/novo"
          className={cn(buttonVariants({ variant: "default" }), "bg-verde-escuro hover:bg-verde-medio")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Inventário
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-verde-medio" />
            {inventarios.length} inventário{inventarios.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {inventarios.length === 0 ? (
            <div className="text-center py-8 text-cinza-medio">
              Nenhum inventário realizado.{" "}
              <Link href="/inventarios/novo" className="text-verde-medio underline">
                Iniciar o primeiro
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Data Início</TableHead>
                    <TableHead>Data Fim</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-center">Itens</TableHead>
                    <TableHead>Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventarios.map((inv) => {
                    const sit = situacaoStyle[inv.situacao];
                    return (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-sm">
                          <Link href={`/inventarios/${inv.id}`} className="text-verde-escuro hover:underline">
                            {inv.codigo}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">
                          {inv.dataInicio.toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-sm">
                          {inv.dataFim ? inv.dataFim.toLocaleDateString("pt-BR") : "—"}
                        </TableCell>
                        <TableCell className="text-sm">{inv.responsavel.nome}</TableCell>
                        <TableCell className="text-sm text-center">{inv._count.itens}</TableCell>
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
