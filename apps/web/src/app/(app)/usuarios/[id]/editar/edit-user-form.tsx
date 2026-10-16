"use client";

import { useActionState } from "react";
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
import { ArrowLeft, Save } from "lucide-react";
import { PERFIS_ACESSO } from "@/lib/constants";
import { updateUser } from "@/lib/actions/users";

const perfilDescricoes: Record<string, string> = {
  admin_geral: "Acesso total. Gerencia usuários, configurações e todas as unidades.",
  admin_unidade: "Administra unidades específicas. Cadastra bens e movimentações.",
  gestor: "Gerencia patrimônio. Registra transferências, baixas e manutenções.",
  responsavel_setor: "Responsável por bens de um setor. Movimentações básicas.",
  contador: "Acesso a relatórios contábeis, depreciação e notas explicativas.",
  auditor: "Visualiza auditoria, relatórios e inventários. Somente leitura.",
  consulta: "Somente visualização. Não altera dados.",
};

interface UsuarioData {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  situacao: string;
  perfil: string;
  unidadeIds: string[];
}

interface UnidadeOption {
  id: string;
  nome: string;
  codigo: string;
}

export function EditUserForm({
  usuario,
  unidades,
}: {
  usuario: UsuarioData;
  unidades: UnidadeOption[];
}) {
  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await updateUser(usuario.id, formData);
    },
    null
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/usuarios" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Editar Usuário</h1>
          <p className="text-cinza-medio mt-1">{usuario.nome}</p>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input id="nome" name="nome" defaultValue={usuario.nome} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" name="email" type="email" defaultValue={usuario.email} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" name="cpf" defaultValue={usuario.cpf} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" defaultValue={usuario.telefone} />
              </div>
              <div className="space-y-2">
                <Label>Situação *</Label>
                <Select name="situacao" defaultValue={usuario.situacao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                    <SelectItem value="BLOQUEADO">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfil de Acesso e Unidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Perfil de Acesso *</Label>
              <Select name="perfil" defaultValue={usuario.perfil}>
                <SelectTrigger>
                  <SelectValue />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {unidades.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <input
                      type="checkbox"
                      id={`unidade-${u.id}`}
                      name="unidadeIds"
                      value={u.id}
                      defaultChecked={usuario.unidadeIds.includes(u.id)}
                      className="rounded border-gray-300 text-verde-medio focus:ring-verde-medio h-4 w-4"
                    />
                    <Label htmlFor={`unidade-${u.id}`} className="cursor-pointer text-sm">
                      <span className="font-medium">{u.nome}</span>
                      <span className="block text-xs text-cinza-medio font-mono">{u.codigo}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/usuarios" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancelar
          </Link>
          <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio" disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
