"use client";

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
import { Save } from "lucide-react";
import { SITUACOES_UNIDADE, UFS_BRASIL } from "@/lib/constants";

interface UnitData {
  codigo: string;
  nome: string;
  responsavel: string;
  telefone: string;
  email: string;
  situacao: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  uf: string;
  cep: string;
  dataInicio: string;
  observacoes: string;
}

export function EditUnitForm({
  action,
  unidade,
  backHref,
}: {
  action: (formData: FormData) => Promise<void>;
  unidade: UnitData;
  backHref: string;
}) {
  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados da Unidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Codigo da Unidade</Label>
              <Input
                id="codigo" name="codigo"
                placeholder="UND-001"
                className="font-mono"
                defaultValue={unidade.codigo}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Unidade *</Label>
              <Input
                id="nome" name="nome"
                placeholder="Ex: Sede Presidente Epitacio"
                required
                defaultValue={unidade.nome}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsavel da Unidade *</Label>
            <Input
              id="responsavel" name="responsavel"
              placeholder="Nome do responsavel"
              required
              defaultValue={unidade.responsavel}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" name="telefone" placeholder="(18) 0000-0000" defaultValue={unidade.telefone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email" name="email"
                type="email"
                placeholder="unidade@institutodalton.org.br"
                defaultValue={unidade.email}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="situacao">Situacao</Label>
            <Select name="situacao" defaultValue={unidade.situacao}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SITUACOES_UNIDADE.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereco</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="logradouro">Logradouro *</Label>
              <Input
                id="logradouro" name="logradouro"
                placeholder="Rua, Avenida, etc."
                required
                defaultValue={unidade.logradouro}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero">Numero</Label>
              <Input id="numero" name="numero" placeholder="No" defaultValue={unidade.numero} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" name="bairro" placeholder="Bairro" defaultValue={unidade.bairro} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" name="complemento" placeholder="Sala, Bloco, etc." defaultValue={unidade.complemento} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade" name="cidade"
                placeholder="Presidente Epitacio"
                required
                defaultValue={unidade.cidade}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uf">Estado (UF) *</Label>
              <Select name="uf" defaultValue={unidade.uf}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UFS_BRASIL.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" name="cep" placeholder="00000-000" defaultValue={unidade.cep} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informacoes Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data_inicio">Data de Inicio de Operacao</Label>
            <Input id="data_inicio" name="data_inicio" type="date" defaultValue={unidade.dataInicio} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observacoes</Label>
            <Textarea
              id="observacoes" name="observacoes"
              placeholder="Informacoes adicionais sobre a unidade..."
              rows={3}
              defaultValue={unidade.observacoes}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Link href={backHref} className={cn(buttonVariants({ variant: "outline" }))}>
          Cancelar
        </Link>
        <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio">
          <Save className="mr-2 h-4 w-4" />
          Salvar Alteracoes
        </Button>
      </div>
    </form>
  );
}
