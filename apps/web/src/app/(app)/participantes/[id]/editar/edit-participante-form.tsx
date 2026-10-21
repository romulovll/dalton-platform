"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";

interface Unidade {
  id: string;
  nome: string;
  codigo: string;
}

interface ParticipanteData {
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  telefone: string;
  endereco: string;
  unidadeId: string;
  situacao: string;
}

export function EditParticipanteForm({
  action,
  participante,
  backHref,
}: {
  action: (formData: FormData) => Promise<void>;
  participante: ParticipanteData;
  backHref: string;
}) {
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    fetch("/api/form-data")
      .then((r) => r.json())
      .then((data) => {
        if (data.unidades) setUnidades(data.unidades);
      });
  }, []);

  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados do Participante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              name="nome"
              placeholder="Nome completo do participante"
              required
              defaultValue={participante.nome}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
              <Input
                id="data_nascimento"
                name="data_nascimento"
                type="date"
                required
                defaultValue={participante.dataNascimento}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidadeId">Unidade *</Label>
              <Select name="unidadeId" defaultValue={participante.unidadeId}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                defaultValue={participante.cpf}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                name="rg"
                placeholder="00.000.000-0"
                defaultValue={participante.rg}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              name="telefone"
              placeholder="(18) 9 0000-0000"
              defaultValue={participante.telefone}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              name="endereco"
              placeholder="Rua, número, bairro, cidade"
              defaultValue={participante.endereco}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="situacao">Situação *</Label>
            <Select name="situacao" defaultValue={participante.situacao}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ATIVO">Ativo</SelectItem>
                <SelectItem value="INATIVO">Inativo</SelectItem>
                <SelectItem value="TRANSFERIDO">Transferido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Link href={backHref} className={cn(buttonVariants({ variant: "outline" }))}>
          Cancelar
        </Link>
        <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio">
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}
