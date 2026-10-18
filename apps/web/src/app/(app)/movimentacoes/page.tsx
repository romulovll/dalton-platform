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
import { Plus, ArrowLeftRight } from "lucide-react";
import { getMovimentacoes } from "@/lib/actions/movements";

const tipoConfig: Record<string, { label: string; className: string }> = {
  TRANSFERENCIA_INTERNA: { label: "Transferência Interna", className: "bg-blue-100 text-blue-800" },
  TRANSFERENCIA_UNIDADE: { label: "Transferência entre Unidades", className: "bg-indigo-100 text-indigo-800" },
  CESSAO: { label: "Cessão", className: "bg-purple-100 text-purple-800" },
  MANUTENCAO_ENVIO: { label: "Envio p/ Manutenção", className: "bg-orange-100 text-orange-800" },
  MANUTENCAO_RETORNO: { label: "Retorno de Manutenção", className: "bg-green-100 text-green-800" },
  BAIXA: { label: "Baixa", className: "bg-red-100 text-red-800" },
};

export default async function MovimentacoesPage() {
  const movimentacoes = await getMovimentacoes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Movimentações</h1>
          <p className="text-cinza-medio mt-1">
            Transferências, baixas e manutenções de bens
          </p>
        </div>
        <Link
          href="/movimentacoes/nova"
          className={cn(buttonVariants({ variant: "default" }), "bg-verde-escuro hover:bg-verde-medio")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Movimentação
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-verde-medio" />
            {movimentacoes.length} movimentação{movimentacoes.length !== 1 ? "ões" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {movimentacoes.length === 0 ? (
            <div className="text-center py-8 text-cinza-medio">
              Nenhuma movimentação registrada.{" "}
              <Link href="/movimentacoes/nova" className="text-verde-medio underline">
                Registrar a primeira
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tombamento</TableHead>
                    <TableHead>Bem</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Registrado por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimentacoes.map((mov) => {
                    const tipo = tipoConfig[mov.tipo];
                    return (
                      <TableRow key={mov.id}>
                        <TableCell className="text-sm">
                          {mov.data.toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={tipo.className}>
                            {tipo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          <Link href={`/bens/${mov.bem.id}`} className="text-verde-escuro hover:underline">
                            {mov.bem.tombamento}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">{mov.bem.descricao}</TableCell>
                        <TableCell className="text-sm max-w-xs truncate">{mov.motivo}</TableCell>
                        <TableCell className="text-sm">{mov.usuario.nome}</TableCell>
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
