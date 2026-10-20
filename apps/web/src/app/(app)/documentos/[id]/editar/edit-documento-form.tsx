"use client";

import { useActionState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

const categorias = [
  { value: "BALANCO", label: "Balanço Patrimonial" },
  { value: "PRESTACAO_CONTAS", label: "Prestação de Contas" },
  { value: "ATA", label: "Ata de Reunião / Assembleia" },
  { value: "ESTATUTO", label: "Estatuto Social" },
  { value: "RELATORIO_ATIVIDADES", label: "Relatório de Atividades" },
  { value: "PARECER_FISCAL", label: "Parecer do Conselho Fiscal" },
  { value: "CERTIDAO", label: "Certidão / Certificado" },
  { value: "CONTRATO_PARCERIA", label: "Contrato / Termo de Parceria" },
  { value: "OUTRO", label: "Outro" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

interface DocumentoData {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  ano: string;
  publicado: boolean;
}

export function EditDocumentoForm({ documento }: { documento: DocumentoData }) {
  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await fetch(`/api/update-documento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: documento.id,
          titulo: formData.get("titulo"),
          descricao: formData.get("descricao"),
          categoria: formData.get("categoria"),
          ano: parseInt(formData.get("ano") as string),
          publicado: formData.get("publicado") !== "off",
        }),
      });
      redirect("/documentos");
    },
    null
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/documentos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Editar Documento</h1>
          <p className="text-cinza-medio mt-1">{documento.titulo}</p>
        </div>
      </div>

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Dados do Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input id="titulo" name="titulo" defaultValue={documento.titulo} required />
              </div>

              <div className="space-y-2">
                <Label>Ano *</Label>
                <Select name="ano" defaultValue={documento.ano}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select name="categoria" defaultValue={documento.categoria}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Publicado</Label>
                <Select name="publicado" defaultValue={documento.publicado ? "on" : "off"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">Sim — visível no portal público</SelectItem>
                    <SelectItem value="off">Não — somente interno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" name="descricao" defaultValue={documento.descricao} rows={2} />
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/documentos">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio" disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
