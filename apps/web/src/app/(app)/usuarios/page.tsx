export const dynamic = "force-dynamic";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Pencil, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";

const perfilDescricoes: Record<string, string> = {
  ADMIN_GERAL: "Acesso total ao sistema. Gerencia usuários, configurações, baixas e todas as unidades.",
  ADMIN_UNIDADE: "Administra uma ou mais unidades. Cadastra bens, movimentações e relatórios da unidade.",
  GESTOR: "Gerencia o patrimônio. Pode registrar transferências, baixas e manutenções.",
  RESPONSAVEL_SETOR: "Responsável por bens de um setor. Visualiza e registra movimentações básicas.",
  CONTADOR: "Acesso aos relatórios contábeis, depreciação e notas explicativas.",
  AUDITOR: "Visualiza auditoria, relatórios e inventários. Não altera dados.",
  CONSULTA: "Somente visualização. Não pode criar, editar ou excluir registros.",
};

const perfilLabels: Record<string, string> = {
  ADMIN_GERAL: "Administrador Geral",
  ADMIN_UNIDADE: "Administrador de Unidade",
  GESTOR: "Gestor Patrimonial",
  RESPONSAVEL_SETOR: "Responsável de Setor",
  CONTADOR: "Contador",
  AUDITOR: "Auditor",
  CONSULTA: "Consulta",
};

const situacaoConfig: Record<string, { label: string; className: string }> = {
  ATIVO: { label: "Ativo", className: "bg-green-100 text-green-800" },
  INATIVO: { label: "Inativo", className: "bg-gray-100 text-gray-800" },
  BLOQUEADO: { label: "Bloqueado", className: "bg-red-100 text-red-800" },
};

export default async function UsuariosPage() {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { nome: "asc" },
    select: {
      id: true,
      nome: true,
      email: true,
      situacao: true,
      unidades: {
        include: { unidade: { select: { nome: true } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Usuários</h1>
          <p className="text-cinza-medio mt-1">
            Gerencie os usuários e permissões do sistema
          </p>
        </div>
        <Link
          href="/usuarios/novo"
          className={cn(buttonVariants({ variant: "default" }), "bg-verde-escuro hover:bg-verde-medio")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-verde-medio" />
            {usuarios.length} usuário{usuarios.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Unidades</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((u) => {
                  const perfis = u.unidades.map((uu) => uu.perfil);
                  const mainPerfil = perfis[0];
                  const unidadeNames = u.unidades.map((uu) => uu.unidade.nome);
                  const sit = situacaoConfig[u.situacao];
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.nome}</TableCell>
                      <TableCell className="text-sm">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-verde-escuro/10 text-verde-escuro">
                          {mainPerfil ? perfilLabels[mainPerfil] : "Sem perfil"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {mainPerfil === "ADMIN_GERAL"
                          ? "Todas"
                          : unidadeNames.join(", ") || "Nenhuma"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={sit.className}>
                          {sit.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/usuarios/${u.id}/editar`}
                          className="inline-flex items-center gap-1 text-sm text-verde-escuro hover:underline"
                        >
                          <Pencil className="h-3 w-3" />
                          Editar
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-verde-medio" />
            Perfis de Acesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(perfilDescricoes).map(([key, desc]) => (
              <div key={key} className="flex gap-3 rounded-lg border p-3">
                <Badge variant="secondary" className="bg-verde-escuro/10 text-verde-escuro h-fit whitespace-nowrap">
                  {perfilLabels[key]}
                </Badge>
                <p className="text-xs text-cinza-escuro">{desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
