export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Building2, MapPin, User, Phone, Mail, Calendar, Pencil, Plus, Package } from "lucide-react";
import { getUnidade, getSetoresByUnidade } from "@/lib/actions/units";
import { AddSetorForm } from "./add-setor-form";

const situacaoConfig: Record<string, { label: string; className: string }> = {
  ATIVA: { label: "Ativa", className: "bg-green-100 text-green-800" },
  INATIVA: { label: "Inativa", className: "bg-gray-100 text-gray-800" },
  EM_IMPLANTACAO: { label: "Em Implantacao", className: "bg-yellow-100 text-yellow-800" },
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-cinza-medio mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-cinza-medio">{label}</p>
        <p className="text-sm text-texto-escuro">{value}</p>
      </div>
    </div>
  );
}

export default async function UnidadeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const unidade = await getUnidade(id);

  if (!unidade) notFound();

  const setores = await getSetoresByUnidade(id);
  const sit = situacaoConfig[unidade.situacao];

  const endereco = [
    unidade.logradouro,
    unidade.numero ? `n ${unidade.numero}` : null,
    unidade.complemento,
    unidade.bairro,
    `${unidade.cidade} - ${unidade.uf}`,
    unidade.cep,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/unidades" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-texto-escuro">
                {unidade.nome}
              </h1>
              {sit && (
                <Badge variant="secondary" className={sit.className}>
                  {sit.label}
                </Badge>
              )}
            </div>
            <p className="text-cinza-medio mt-1 font-mono">{unidade.codigo}</p>
          </div>
        </div>
        <Link
          href={`/unidades/${id}/editar`}
          className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        >
          <Pencil className="h-4 w-4" />
          Editar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informacoes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-verde-medio" />
              Informacoes da Unidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow icon={Building2} label="Codigo" value={unidade.codigo} />
            <InfoRow icon={Building2} label="Nome" value={unidade.nome} />
            <InfoRow icon={User} label="Responsavel" value={unidade.responsavel} />
            <InfoRow icon={Phone} label="Telefone" value={unidade.telefone} />
            <InfoRow icon={Mail} label="E-mail" value={unidade.email} />
            <InfoRow icon={Calendar} label="Data de Inicio"
              value={unidade.dataInicio?.toLocaleDateString("pt-BR")} />
          </CardContent>
        </Card>

        {/* Endereco */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-verde-medio" />
              Endereco
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow icon={MapPin} label="Endereco completo" value={endereco} />
          </CardContent>
        </Card>
      </div>

      {/* Setores */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4 text-verde-medio" />
            Setores ({setores.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {setores.length === 0 ? (
            <p className="text-sm text-cinza-medio text-center py-6">
              Nenhum setor cadastrado nesta unidade.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Bens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {setores.map((setor) => (
                    <TableRow key={setor.id}>
                      <TableCell className="font-medium">{setor.nome}</TableCell>
                      <TableCell>{setor._count.bens}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <AddSetorForm unidadeId={id} />
        </CardContent>
      </Card>

      {/* Observacoes */}
      {unidade.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Observacoes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cinza-escuro whitespace-pre-wrap">{unidade.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="text-xs text-cinza-medio flex gap-6">
        <span>Total de bens: {unidade._count.bens}</span>
      </div>
    </div>
  );
}
