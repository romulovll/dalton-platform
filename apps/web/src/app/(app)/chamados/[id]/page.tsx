export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, MessageSquareWarning, Save } from "lucide-react";
import { getChamado, updateChamado } from "@/lib/actions/chamados";

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

export default async function ChamadoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chamado = await getChamado(id);
  if (!chamado) notFound();

  const tipo = tipoConfig[chamado.tipo];
  const prio = prioridadeConfig[chamado.prioridade];
  const sit = situacaoConfig[chamado.situacao];

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateChamado(id, formData);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/chamados">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">{chamado.titulo}</h1>
          <p className="text-cinza-medio mt-1">
            Aberto por {chamado.usuario.nome} em {chamado.createdAt.toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary" className={tipo.className}>{tipo.label}</Badge>
        <Badge variant="secondary" className={prio.className}>Prioridade: {prio.label}</Badge>
        <Badge variant="secondary" className={sit.className}>{sit.label}</Badge>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquareWarning className="h-4 w-4 text-verde-medio" />
            Descrição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{chamado.descricao}</p>
        </CardContent>
      </Card>

      {/* Response (if exists) */}
      {chamado.resposta && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{chamado.resposta}</p>
          </CardContent>
        </Card>
      )}

      {/* Admin: update status & respond */}
      {chamado.situacao !== "FECHADO" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atualizar Chamado</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label>Situação</Label>
                <Select name="situacao" defaultValue={chamado.situacao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ABERTO">Aberto</SelectItem>
                    <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                    <SelectItem value="RESOLVIDO">Resolvido</SelectItem>
                    <SelectItem value="FECHADO">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resposta">Resposta</Label>
                <Textarea
                  id="resposta"
                  name="resposta"
                  defaultValue={chamado.resposta ?? ""}
                  placeholder="Escreva a resposta ou resolução do chamado..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio">
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="text-xs text-cinza-medio flex gap-6">
        <span>Criado em: {chamado.createdAt.toLocaleString("pt-BR")}</span>
        <span>Atualizado em: {chamado.updatedAt.toLocaleString("pt-BR")}</span>
      </div>
    </div>
  );
}
