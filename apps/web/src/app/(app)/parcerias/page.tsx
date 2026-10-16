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
import { Plus, Handshake } from "lucide-react";
import { getParcerias } from "@/lib/actions/partnerships";

const situacaoStyle: Record<string, string> = {
  vigente: "bg-green-100 text-green-800",
  encerrada: "bg-gray-100 text-gray-800",
  prestacao_contas: "bg-yellow-100 text-yellow-800",
};

export default async function ParceriasPage() {
  const parcerias = await getParcerias();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Parcerias</h1>
          <p className="text-cinza-medio mt-1">
            Termos de colaboração, fomento e convênios
          </p>
        </div>
        <Link
          href="/parcerias/nova"
          className={cn(buttonVariants({ variant: "default" }), "bg-verde-escuro hover:bg-verde-medio")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Parceria
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Handshake className="h-5 w-5 text-verde-medio" />
            {parcerias.length} parceria{parcerias.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {parcerias.length === 0 ? (
            <div className="text-center py-8 text-cinza-medio">
              Nenhuma parceria cadastrada.{" "}
              <Link href="/parcerias/nova" className="text-verde-medio underline">
                Cadastrar a primeira
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Órgão Parceiro</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Fim</TableHead>
                  <TableHead className="text-right">Valor Repasse</TableHead>
                  <TableHead>Bens</TableHead>
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parcerias.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">
                      <Link href={`/parcerias/${p.id}`} className="text-verde-escuro hover:underline">
                        {p.numero}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{p.tipo}</TableCell>
                    <TableCell className="text-sm">{p.orgaoParceiro}</TableCell>
                    <TableCell className="text-sm">
                      {p.dataInicio.toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {p.dataFim ? p.dataFim.toLocaleDateString("pt-BR") : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-right">
                      {p.valorRepasse
                        ? Number(p.valorRepasse).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-center">{p._count.bens}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={situacaoStyle[p.situacao] || "bg-gray-100"}>
                        {p.situacao.charAt(0).toUpperCase() + p.situacao.slice(1).replace("_", " ")}
                      </Badge>
                    </TableCell>
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
