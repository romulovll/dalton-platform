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
import { ArrowLeft, Send } from "lucide-react";
import { createChamado } from "@/lib/actions/chamados";

export default function NovoChamadoPage() {
  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await createChamado(formData);
    },
    null
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/chamados">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Novo Chamado</h1>
          <p className="text-cinza-medio mt-1">Relatar erro, solicitar ajuste ou enviar sugestão</p>
        </div>
      </div>

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Descreva o problema ou sugestão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select name="tipo" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ERRO">Erro no sistema</SelectItem>
                    <SelectItem value="AJUSTE">Ajuste necessário</SelectItem>
                    <SelectItem value="DUVIDA">Dúvida</SelectItem>
                    <SelectItem value="SUGESTAO">Sugestão de melhoria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioridade *</Label>
                <Select name="prioridade" defaultValue="MEDIA">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAIXA">Baixa — pode esperar</SelectItem>
                    <SelectItem value="MEDIA">Média — importante mas não urgente</SelectItem>
                    <SelectItem value="ALTA">Alta — impede trabalho parcialmente</SelectItem>
                    <SelectItem value="URGENTE">Urgente — sistema parado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Resumo curto do problema ou sugestão"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição detalhada *</Label>
              <Textarea
                id="descricao"
                name="descricao"
                placeholder="Descreva o que aconteceu, em qual página, o que esperava que acontecesse..."
                rows={6}
                required
              />
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
              <p className="font-medium">Dicas para um bom relato:</p>
              <ul className="list-disc pl-4 mt-1 space-y-0.5 text-xs">
                <li>Informe em qual página o problema ocorreu</li>
                <li>Descreva os passos para reproduzir o erro</li>
                <li>Diga o que esperava que acontecesse vs. o que aconteceu</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/chamados">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio" disabled={isPending}>
                <Send className="mr-2 h-4 w-4" />
                Enviar Chamado
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
