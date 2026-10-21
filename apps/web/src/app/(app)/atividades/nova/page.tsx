"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, Save, Activity } from "lucide-react";
import { createAtividade } from "@/lib/actions/atividades";

interface Unidade {
  id: string;
  nome: string;
}

const PUBLICOS_ALVO = [
  { value: "CRIANCAS", label: "Crianças" },
  { value: "IDOSOS", label: "Idosos" },
  { value: "AMBOS", label: "Ambos" },
];

export default function NovaAtividadePage() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    fetch("/api/form-data")
      .then((r) => r.json())
      .then((data) => {
        if (data.unidades) setUnidades(data.unidades);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/atividades"
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Nova Atividade</h1>
          <p className="text-cinza-medio mt-1">
            Cadastrar uma nova atividade do Instituto
          </p>
        </div>
      </div>

      <form action={createAtividade} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-verde-medio" />
              Dados da Atividade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Nome da atividade"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                placeholder="Descreva a atividade, objetivos, metodologia..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publicoAlvo">Público-alvo *</Label>
                <Select name="publicoAlvo" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o público-alvo" />
                  </SelectTrigger>
                  <SelectContent>
                    {PUBLICOS_ALVO.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidadeId">Unidade</Label>
                <Select name="unidadeId">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/atividades" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancelar
          </Link>
          <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio">
            <Save className="mr-2 h-4 w-4" />
            Salvar Atividade
          </Button>
        </div>
      </form>
    </div>
  );
}
