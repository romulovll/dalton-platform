"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  ClipboardCheck,
  Lock,
} from "lucide-react";
import { updateItemStatus, concluirInventario } from "@/lib/actions/inventory";
import { StatusVerificacao } from "@prisma/client";

interface ItemData {
  id: string;
  status: string;
  observacoes: string;
  verificadoEm: string | null;
  bem: {
    id: string;
    tombamento: string;
    descricao: string;
    localizacao: string;
    unidade: string;
  };
}

interface InventarioData {
  id: string;
  codigo: string;
  dataInicio: string;
  dataFim: string | null;
  situacao: string;
  responsavel: string;
  observacoes: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDENTE: { label: "Pendente", className: "bg-gray-100 text-gray-800" },
  LOCALIZADO: { label: "Localizado", className: "bg-green-100 text-green-800" },
  NAO_LOCALIZADO: { label: "Não Localizado", className: "bg-red-100 text-red-800" },
  DIVERGENTE: { label: "Divergente", className: "bg-yellow-100 text-yellow-800" },
};

export function InventarioDetail({
  inventario,
  itens,
}: {
  inventario: InventarioData;
  itens: ItemData[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");

  const isClosed = inventario.situacao !== "EM_ANDAMENTO";

  const counts = {
    total: itens.length,
    PENDENTE: itens.filter((i) => i.status === "PENDENTE").length,
    LOCALIZADO: itens.filter((i) => i.status === "LOCALIZADO").length,
    NAO_LOCALIZADO: itens.filter((i) => i.status === "NAO_LOCALIZADO").length,
    DIVERGENTE: itens.filter((i) => i.status === "DIVERGENTE").length,
  };

  const filtered = itens.filter((item) => {
    if (filter !== "ALL" && item.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.bem.tombamento.toLowerCase().includes(q) ||
        item.bem.descricao.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleStatusChange(itemId: string, status: StatusVerificacao) {
    startTransition(async () => {
      await updateItemStatus(itemId, status);
      router.refresh();
    });
  }

  function handleConcluir() {
    if (!confirm("Deseja concluir este inventário? Bens não localizados serão marcados como DESAPARECIDO.")) return;
    startTransition(async () => {
      await concluirInventario(inventario.id);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/inventarios">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-texto-escuro">{inventario.codigo}</h1>
            <p className="text-cinza-medio mt-1">
              Responsável: {inventario.responsavel} — Início: {inventario.dataInicio}
              {inventario.dataFim ? ` — Fim: ${inventario.dataFim}` : ""}
            </p>
          </div>
        </div>
        {!isClosed && counts.PENDENTE === 0 && (
          <Button
            onClick={handleConcluir}
            className="bg-verde-escuro hover:bg-verde-medio"
            disabled={isPending}
          >
            <Lock className="mr-2 h-4 w-4" />
            Concluir Inventário
          </Button>
        )}
        {isClosed && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 text-base px-4 py-1">
            Concluído
          </Badge>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total", value: counts.total, color: "text-texto-escuro" },
          { label: "Pendentes", value: counts.PENDENTE, color: "text-gray-600" },
          { label: "Localizados", value: counts.LOCALIZADO, color: "text-green-600" },
          { label: "Não Localizados", value: counts.NAO_LOCALIZADO, color: "text-red-600" },
          { label: "Divergentes", value: counts.DIVERGENTE, color: "text-yellow-600" },
        ].map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-sm text-cinza-medio">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-verde-escuro h-3 rounded-full transition-all"
          style={{
            width: `${counts.total > 0 ? ((counts.total - counts.PENDENTE) / counts.total) * 100 : 0}%`,
          }}
        />
      </div>
      <p className="text-sm text-cinza-medio text-center">
        {counts.total - counts.PENDENTE} de {counts.total} verificados ({counts.total > 0 ? Math.round(((counts.total - counts.PENDENTE) / counts.total) * 100) : 0}%)
      </p>

      {/* Search + filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-verde-medio" />
              Itens do Inventário
            </CardTitle>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-cinza-medio" />
                <Input
                  className="pl-8 w-60"
                  placeholder="Buscar tombamento..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="border rounded px-2 py-1.5 text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="ALL">Todos</option>
                <option value="PENDENTE">Pendentes</option>
                <option value="LOCALIZADO">Localizados</option>
                <option value="NAO_LOCALIZADO">Não Localizados</option>
                <option value="DIVERGENTE">Divergentes</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tombamento</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                {!isClosed && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const st = statusConfig[item.status];
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">
                      <Link href={`/bens/${item.bem.id}`} className="text-verde-escuro hover:underline">
                        {item.bem.tombamento}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{item.bem.descricao}</TableCell>
                    <TableCell className="text-sm">{item.bem.unidade}</TableCell>
                    <TableCell className="text-sm">{item.bem.localizacao || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={st.className}>{st.label}</Badge>
                    </TableCell>
                    {!isClosed && (
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => handleStatusChange(item.id, "LOCALIZADO")}
                            disabled={isPending}
                            title="Localizado"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleStatusChange(item.id, "NAO_LOCALIZADO")}
                            disabled={isPending}
                            title="Não Localizado"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-yellow-600 hover:bg-yellow-50"
                            onClick={() => handleStatusChange(item.id, "DIVERGENTE")}
                            disabled={isPending}
                            title="Divergente"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
