export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, QrCode, Pencil, Camera, Building2, User, Calendar, DollarSign, Tag, MapPin, FileText, Shield } from "lucide-react";
import { getBem } from "@/lib/actions/assets";
import { PhotoUpload } from "@/components/app/photo-upload";

const estadoLabels: Record<string, { label: string; className: string }> = {
  EXCELENTE: { label: "Excelente", className: "bg-green-100 text-green-800" },
  BOM: { label: "Bom", className: "bg-emerald-100 text-emerald-800" },
  REGULAR: { label: "Regular", className: "bg-yellow-100 text-yellow-800" },
  RUIM: { label: "Ruim", className: "bg-orange-100 text-orange-800" },
  INSERVIVEL: { label: "Inservível", className: "bg-red-100 text-red-800" },
};

const situacaoLabels: Record<string, { label: string; className: string }> = {
  ATIVO: { label: "Ativo", className: "bg-green-100 text-green-800" },
  EM_MANUTENCAO: { label: "Em Manutenção", className: "bg-blue-100 text-blue-800" },
  CEDIDO: { label: "Cedido", className: "bg-purple-100 text-purple-800" },
  BAIXADO: { label: "Baixado", className: "bg-gray-100 text-gray-800" },
  DESAPARECIDO: { label: "Desaparecido", className: "bg-red-100 text-red-800" },
};

const formaLabels: Record<string, string> = {
  COMPRA: "Compra",
  DOACAO: "Doação",
  CESSAO: "Cessão",
  COMODATO: "Comodato",
  TRANSFERENCIA: "Transferência",
};

const origemLabels: Record<string, string> = {
  PROPRIO: "Recursos Próprios",
  PARCERIA_PUBLICA: "Parceria Pública",
  DOACAO: "Doação",
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

export default async function BemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bem = await getBem(id);

  if (!bem) notFound();

  const estado = estadoLabels[bem.estadoConservacao];
  const situacao = situacaoLabels[bem.situacao];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/bens" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-texto-escuro font-mono">
                {bem.tombamento}
              </h1>
              <Badge variant="secondary" className={estado.className}>{estado.label}</Badge>
              <Badge variant="secondary" className={situacao.className}>{situacao.label}</Badge>
            </div>
            <p className="text-cinza-medio mt-1">{bem.descricao}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/bens/${id}/editar`}
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
          <Link
            href={`/api/etiquetas?ids=${bem.id}`}
            target="_blank"
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <QrCode className="h-4 w-4" />
            Etiqueta QR
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identificação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4 text-verde-medio" />
              Identificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow icon={Tag} label="Tombamento" value={bem.tombamento} />
            <InfoRow icon={Tag} label="Categoria" value={bem.categoria.nome} />
            <InfoRow icon={Tag} label="Tipo" value={bem.tipoItem?.nome} />
            <InfoRow icon={Tag} label="Marca" value={bem.marca} />
            <InfoRow icon={Tag} label="Modelo" value={bem.modelo} />
            <InfoRow icon={Tag} label="Nº de Série" value={bem.numeroSerie} />
          </CardContent>
        </Card>

        {/* Localização */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-verde-medio" />
              Localização e Responsável
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow icon={Building2} label="Unidade" value={bem.unidadeAtual.nome} />
            <InfoRow icon={MapPin} label="Setor" value={bem.setor?.nome} />
            <InfoRow icon={MapPin} label="Localização" value={bem.localizacao} />
            <InfoRow icon={User} label="Responsável / Guardião" value={bem.responsavel} />
          </CardContent>
        </Card>

        {/* Aquisição */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-verde-medio" />
              Dados de Aquisição
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow icon={Calendar} label="Data de Aquisição"
              value={bem.dataAquisicao.toLocaleDateString("pt-BR")} />
            <InfoRow icon={DollarSign} label="Valor de Aquisição"
              value={`R$ ${Number(bem.valorAquisicao).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
            <InfoRow icon={Tag} label="Forma de Aquisição"
              value={formaLabels[bem.formaAquisicao]} />
            <InfoRow icon={FileText} label="Nota Fiscal" value={bem.notaFiscal} />
            <InfoRow icon={Building2} label="Fornecedor" value={bem.fornecedor} />
            <InfoRow icon={DollarSign} label="Origem dos Recursos"
              value={origemLabels[bem.origemRecurso]} />
            <InfoRow icon={FileText} label="Nº Convênio/Parceria" value={bem.numeroParceria} />
          </CardContent>
        </Card>

        {/* Depreciação e Conformidade */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-verde-medio" />
              Depreciação e Conformidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow icon={Calendar} label="Vida Útil"
              value={bem.vidaUtilMeses ? `${bem.vidaUtilMeses} meses` : `${bem.categoria.vidaUtilAnos * 12} meses (padrão da categoria)`} />
            <InfoRow icon={DollarSign} label="Valor Residual"
              value={bem.valorResidual ? `R$ ${Number(bem.valorResidual).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "R$ 0,00"} />
            <InfoRow icon={DollarSign} label="Depreciação Acumulada"
              value={`R$ ${Number(bem.depreciacaoAcumulada).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
            <Separator className="my-2" />
            <div className="flex gap-4 pt-1">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${bem.inalienabilidade ? "bg-vermelho" : "bg-cinza-medio/30"}`} />
                <span className="text-xs text-cinza-escuro">
                  {bem.inalienabilidade ? "Inalienável" : "Alienável"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${bem.bemRemanescente ? "bg-amarelo" : "bg-cinza-medio/30"}`} />
                <span className="text-xs text-cinza-escuro">
                  {bem.bemRemanescente ? "Bem Remanescente" : "Não Remanescente"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Foto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="h-4 w-4 text-verde-medio" />
            Foto do Bem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUpload bemId={bem.id} currentUrl={bem.fotoUrl} />
        </CardContent>
      </Card>

      {/* Observações */}
      {bem.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cinza-escuro whitespace-pre-wrap">{bem.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          {bem.movimentacoes.length === 0 ? (
            <p className="text-sm text-cinza-medio text-center py-6">
              Nenhuma movimentação registrada para este bem.
            </p>
          ) : (
            <div className="space-y-3">
              {bem.movimentacoes.map((mov) => (
                <div key={mov.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="h-8 w-8 rounded-full bg-verde-escuro/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-verde-escuro" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{mov.tipo.replace(/_/g, " ")}</p>
                    <p className="text-xs text-cinza-medio">
                      {mov.data.toLocaleDateString("pt-BR")} — {mov.usuario.nome}
                    </p>
                    {mov.motivo && <p className="text-xs text-cinza-escuro mt-1">{mov.motivo}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <div className="text-xs text-cinza-medio flex gap-6">
        <span>Criado em: {bem.createdAt.toLocaleDateString("pt-BR")}</span>
        <span>Última atualização: {bem.updatedAt.toLocaleDateString("pt-BR")}</span>
      </div>
    </div>
  );
}
