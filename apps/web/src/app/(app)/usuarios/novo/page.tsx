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
import { ArrowLeft, Save, Info } from "lucide-react";
import { PERFIS_ACESSO } from "@/lib/constants";
import { createUser } from "@/lib/actions/users";

const perfilDescricoes: Record<string, string> = {
  admin_geral: "Acesso total. Gerencia usuários, configurações e todas as unidades.",
  admin_unidade: "Administra unidades específicas. Cadastra bens e movimentações.",
  gestor: "Gerencia patrimônio. Registra transferências, baixas e manutenções.",
  responsavel_setor: "Responsável por bens de um setor. Movimentações básicas.",
  contador: "Acesso a relatórios contábeis, depreciação e notas explicativas.",
  auditor: "Visualiza auditoria, relatórios e inventários. Somente leitura.",
  consulta: "Somente visualização. Não altera dados.",
};

interface Unidade {
  id: string;
  nome: string;
  codigo: string;
}

export default function NovoUsuarioPage() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    fetch("/api/form-data").then((r) => r.json()).then((data) => {
      setUnidades(data.unidades);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/usuarios" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">
            Novo Usuario
          </h1>
          <p className="text-cinza-medio mt-1">
            Cadastrar um novo usuario no sistema
          </p>
        </div>
      </div>

      <form action={createUser} className="space-y-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome" name="nome"
                placeholder="Nome completo do usuario"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email" name="email"
                  type="email"
                  placeholder="usuario@institutodalton.org.br"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf" name="cpf"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone" name="telefone"
                  placeholder="(18) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha Temporaria *</Label>
                <Input
                  id="senha" name="senha"
                  type="password"
                  placeholder="Senha inicial"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                O usuario devera alterar a senha no primeiro acesso ao sistema.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Perfil e Unidades */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Acesso e Unidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="perfil">Perfil de Acesso *</Label>
              <Select name="perfil">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  {PERFIS_ACESSO.map((p) => (
                    <SelectItem key={p.value} value={p.value.toUpperCase()}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-1 gap-1.5 mt-2">
                {PERFIS_ACESSO.map((p) => (
                  <p key={p.value} className="text-xs text-cinza-medio">
                    <span className="font-medium text-cinza-escuro">{p.label}:</span> {perfilDescricoes[p.value]}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Unidades de Acesso *</Label>
              <p className="text-xs text-cinza-medio">
                Selecione as unidades que o usuario tera acesso
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {unidades.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <input
                      type="checkbox"
                      id={`unidade-${u.id}`}
                      name="unidadeIds"
                      value={u.id}
                      className="rounded border-gray-300 text-verde-medio focus:ring-verde-medio h-4 w-4"
                    />
                    <Label htmlFor={`unidade-${u.id}`} className="cursor-pointer text-sm">
                      <span className="font-medium">{u.nome}</span>
                      <span className="block text-xs text-cinza-medio font-mono">{u.codigo}</span>
                    </Label>
                  </div>
                ))}
              </div>
              {unidades.length === 0 && (
                <p className="text-sm text-cinza-medio text-center py-4">
                  Carregando unidades...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/usuarios" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancelar
          </Link>
          <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio">
            <Save className="mr-2 h-4 w-4" />
            Salvar Usuario
          </Button>
        </div>
      </form>
    </div>
  );
}
