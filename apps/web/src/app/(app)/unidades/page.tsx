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
import { Plus, Building2 } from "lucide-react";
import { getUnidades } from "@/lib/actions/units";

const situacaoConfig: Record<string, { label: string; className: string }> = {
  ATIVA: { label: "Ativa", className: "bg-green-100 text-green-800" },
  INATIVA: { label: "Inativa", className: "bg-gray-100 text-gray-800" },
  EM_IMPLANTACAO: {
    label: "Em Implantação",
    className: "bg-yellow-100 text-yellow-800",
  },
};

export default async function UnidadesPage() {
  const unidades = await getUnidades();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Unidades</h1>
          <p className="text-cinza-medio mt-1">
            Gerencie as unidades do Instituto
          </p>
        </div>
        <Link
          href="/unidades/nova"
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-verde-escuro hover:bg-verde-medio"
          )}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Unidade
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-verde-medio" />
            {unidades.length} unidade{unidades.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unidades.length === 0 ? (
            <div className="text-center py-8 text-cinza-medio">
              Nenhuma unidade cadastrada.{" "}
              <Link href="/unidades/nova" className="text-verde-medio underline">
                Cadastrar a primeira
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Bens</TableHead>
                    <TableHead>Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unidades.map((unidade) => {
                    const sit = situacaoConfig[unidade.situacao];
                    return (
                      <TableRow key={unidade.id}>
                        <TableCell className="font-mono text-sm">
                          {unidade.codigo}
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            href={`/unidades/${unidade.id}`}
                            className="text-verde-escuro hover:underline"
                          >
                            {unidade.nome}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {unidade.cidade} — {unidade.uf}
                        </TableCell>
                        <TableCell>{unidade.responsavel}</TableCell>
                        <TableCell>{unidade._count.bens}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={sit.className}>
                            {sit.label}
                          </Badge>
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
