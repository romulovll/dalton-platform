"use client";

import { useState, useEffect, useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { createAgendamento } from "@/lib/actions/psicologia";

interface Participante {
  id: string;
  nome: string;
}

interface Unidade {
  id: string;
  nome: string;
}

export default function NovoAgendamentoPage() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    fetch("/api/form-data").then((r) => r.json()).then((data) => {
      setUnidades(data.unidades || []);
    });
    fetch("/api/participantes-list").then((r) => r.json()).then((data) => {
      setParticipantes(data || []);
    }).catch(() => {});
  }, []);

  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await createAgendamento(formData);
    },
    null
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/psicologia" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Novo Agendamento</h1>
          <p className="text-cinza-medio mt-1">Agendar atendimento psicológico</p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>Nenhuma informação clínica é registrada neste sistema. Apenas data, horário, tipo de atendimento e presença.</p>
      </div>

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Dados do Agendamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Participante *</Label>
                <Select name="participanteId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o participante" />
                  </SelectTrigger>
                  <SelectContent>
                    {participantes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Atendimento *</Label>
                <Select name="tipo" defaultValue="INDIVIDUAL">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="GRUPO">Grupo</SelectItem>
                    <SelectItem value="FAMILIA">Família</SelectItem>
                    <SelectItem value="ACOLHIMENTO">Acolhimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataHora">Data e Horário *</Label>
                <Input id="dataHora" name="dataHora" type="datetime-local" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (minutos)</Label>
                <Input id="duracao" name="duracao" type="number" defaultValue="50" min="15" max="120" />
              </div>

              <div className="space-y-2">
                <Label>Unidade</Label>
                <Select name="unidadeId">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/psicologia">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio" disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                Agendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
