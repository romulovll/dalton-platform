export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Pencil, Handshake, Package } from "lucide-react";
import { getParceria } from "@/lib/actions/partnerships";

export default async function ParceriaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parceria = await getParceria(id);
  if (!parceria) notFound();

  const totalValor = parceria.bens.reduce(
    (sum, b) => sum + Number(b.valorAquisicao),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/parcerias">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-texto-escuro">{parceria.numero}</h1>
            <p className="text-cinza-medio mt-1">{parceria.tipo} — {parceria.orgaoParceiro}</p>
          </div>
        </div>
        <Link href={`/parcerias/${id}/editar`}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Partnership details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-cinza-medio">Situação</p>
            <Badge variant="secondary" className={parceria.situacao === "vigente" ? "bg-green-100 text-green-800" : "bg-gray-100"}>
              {parceria.situacao.charAt(0).toUpperCase() + parceria.situacao.slice(1).replace("_", " ")}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-cinza-medio">Vigência</p>
            <p className="text-lg font-semibold">
              {parceria.dataInicio.toLocaleDateString("pt-BR")}
              {parceria.dataFim ? ` — ${parceria.dataFim.toLocaleDateString("pt-BR")}` : " — em aberto"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-cinza-medio">Valor do Repasse</p>
            <p className="text-lg font-semibold">
              {parceria.valorRepasse
                ? Number(parceria.valorRepasse).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                : "Não informado"}
            </p>
          </CardContent>
        </Card>
      </div>

      {parceria.observacoes && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-cinza-medio mb-1">Observações</p>
            <p className="text-sm">{parceria.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Assets linked to this partnership */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-verde-medio" />
            Bens Vinculados ({parceria.bens.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {parceria.bens.length === 0 ? (
            <div className="text-center py-6 text-cinza-medio">
              Nenhum bem vinculado a esta parceria.
              <br />
              <span className="text-sm">Para vincular, edite o bem e selecione esta parceria.</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tombamento</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parceria.bens.map((bem) => (
                    <TableRow key={bem.id}>
                      <TableCell className="font-mono text-sm">
                        <Link href={`/bens/${bem.id}`} className="text-verde-escuro hover:underline">
                          {bem.tombamento}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">{bem.descricao}</TableCell>
                      <TableCell className="text-sm text-right">
                        {Number(bem.valorAquisicao).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={bem.situacao === "ATIVO" ? "bg-green-100 text-green-800" : "bg-gray-100"}>
                          {bem.situacao}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-right text-sm font-semibold">
                Total: {totalValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
