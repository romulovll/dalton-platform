"use client";

import { useActionState } from "react";
import Link from "next/link";
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
import { updateParceria } from "@/lib/actions/partnerships";

interface ParceriaData {
  id: string;
  numero: string;
  tipo: string;
  orgaoParceiro: string;
  dataInicio: string;
  dataFim: string;
  valorRepasse: string;
  situacao: string;
  observacoes: string;
}

const tiposParceria = [
  "Termo de Colaboração",
  "Termo de Fomento",
  "Acordo de Cooperação",
  "Convênio",
  "Contrato de Gestão",
];

export function EditParceriaForm({ parceria }: { parceria: ParceriaData }) {
  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await updateParceria(parceria.id, formData);
    },
    null
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/parcerias/${parceria.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Editar Parceria</h1>
          <p className="text-cinza-medio mt-1">{parceria.numero}</p>
        </div>
      </div>

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Dados da Parceria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número *</Label>
                <Input id="numero" name="numero" defaultValue={parceria.numero} required />
              </div>

              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select name="tipo" defaultValue={parceria.tipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposParceria.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgao_parceiro">Órgão Parceiro *</Label>
                <Input id="orgao_parceiro" name="orgao_parceiro" defaultValue={parceria.orgaoParceiro} required />
              </div>

              <div className="space-y-2">
                <Label>Situação *</Label>
                <Select name="situacao" defaultValue={parceria.situacao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vigente">Vigente</SelectItem>
                    <SelectItem value="encerrada">Encerrada</SelectItem>
                    <SelectItem value="prestacao_contas">Em Prestação de Contas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data de Início *</Label>
                <Input id="data_inicio" name="data_inicio" type="date" defaultValue={parceria.dataInicio} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim">Data de Encerramento</Label>
                <Input id="data_fim" name="data_fim" type="date" defaultValue={parceria.dataFim} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_repasse">Valor do Repasse (R$)</Label>
                <Input id="valor_repasse" name="valor_repasse" type="number" step="0.01" min="0" defaultValue={parceria.valorRepasse} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" name="observacoes" defaultValue={parceria.observacoes} rows={3} />
            </div>

            <div className="flex gap-3 pt-4">
              <Link href={`/parcerias/${parceria.id}`}>
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
