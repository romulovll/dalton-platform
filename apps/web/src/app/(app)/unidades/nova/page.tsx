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
import { ArrowLeft, Save } from "lucide-react";
import { SITUACOES_UNIDADE, UFS_BRASIL } from "@/lib/constants";
import { createUnit } from "@/lib/actions/units";

export default function NovaUnidadePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/unidades" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">
            Nova Unidade
          </h1>
          <p className="text-cinza-medio mt-1">
            Cadastrar uma nova unidade do Instituto
          </p>
        </div>
      </div>

      <form action={createUnit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Unidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código da Unidade</Label>
                <Input
                  id="codigo" name="codigo"
                  placeholder="UND-001"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Unidade *</Label>
                <Input
                  id="nome" name="nome"
                  placeholder="Ex: Sede Presidente Epitácio"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável da Unidade *</Label>
              <Input
                id="responsavel" name="responsavel"
                placeholder="Nome do responsável"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" placeholder="(18) 0000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email" name="email"
                  type="email"
                  placeholder="unidade@institutodalton.org.br"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="situacao">Situação</Label>
              <Select defaultValue="ativa">
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
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="logradouro">Logradouro *</Label>
                <Input
                  id="logradouro" name="logradouro"
                  placeholder="Rua, Avenida, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" name="numero" placeholder="Nº" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" name="bairro" placeholder="Bairro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input id="complemento" name="complemento" placeholder="Sala, Bloco, etc." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade" name="cidade"
                  placeholder="Presidente Epitácio"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uf">Estado (UF) *</Label>
                <Select defaultValue="SP">
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
                <Input id="cep" name="cep" placeholder="00000-000" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início de Operação</Label>
              <Input id="data_inicio" name="data_inicio" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes" name="observacoes"
                placeholder="Informações adicionais sobre a unidade..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/unidades" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancelar
          </Link>
          <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio">
            <Save className="mr-2 h-4 w-4" />
            Salvar Unidade
          </Button>
        </div>
      </form>
    </div>
  );
}
