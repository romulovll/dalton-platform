"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { QrCode } from "lucide-react";

interface BemRow {
  id: string;
  tombamento: string;
  descricao: string;
  categoria: string;
  unidade: string;
  responsavel: string;
  estadoConservacao: string;
  situacao: string;
  valorAquisicao: number;
}

const estadoColors: Record<string, string> = {
  EXCELENTE: "bg-green-100 text-green-800",
  BOM: "bg-emerald-100 text-emerald-800",
  REGULAR: "bg-yellow-100 text-yellow-800",
  RUIM: "bg-orange-100 text-orange-800",
  INSERVIVEL: "bg-red-100 text-red-800",
};

const estadoLabels: Record<string, string> = {
  EXCELENTE: "Excelente",
  BOM: "Bom",
  REGULAR: "Regular",
  RUIM: "Ruim",
  INSERVIVEL: "Inservível",
};

const situacaoColors: Record<string, string> = {
  ATIVO: "bg-green-100 text-green-800",
  EM_MANUTENCAO: "bg-blue-100 text-blue-800",
  CEDIDO: "bg-purple-100 text-purple-800",
  BAIXADO: "bg-gray-100 text-gray-800",
  DESAPARECIDO: "bg-red-100 text-red-800",
};

const situacaoLabels: Record<string, string> = {
  ATIVO: "Ativo",
  EM_MANUTENCAO: "Em Manutenção",
  CEDIDO: "Cedido",
  BAIXADO: "Baixado",
  DESAPARECIDO: "Desaparecido",
};

export function BensTable({ bens }: { bens: BemRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = bens.length > 0 && selected.size === bens.length;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(bens.map((b) => b.id)));
    }
  }

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function printLabels() {
    const ids = Array.from(selected).join(",");
    window.open(`/api/etiquetas?ids=${ids}`, "_blank");
  }

  return (
    <>
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-verde-escuro/5 border border-verde-escuro/20">
          <span className="text-sm font-medium text-verde-escuro">
            {selected.size} selecionado{selected.size !== 1 ? "s" : ""}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="text-verde-escuro border-verde-escuro"
            onClick={printLabels}
          >
            <QrCode className="mr-1 h-3 w-3" />
            Imprimir Etiquetas
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="rounded border-gray-300 h-4 w-4"
              />
            </TableHead>
            <TableHead>Tombamento</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Situação</TableHead>
            <TableHead className="text-right">Valor (R$)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bens.map((bem) => (
            <TableRow key={bem.id} className={selected.has(bem.id) ? "bg-verde-escuro/5" : ""}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selected.has(bem.id)}
                  onChange={() => toggle(bem.id)}
                  className="rounded border-gray-300 h-4 w-4"
                />
              </TableCell>
              <TableCell className="font-mono text-sm font-medium">
                <Link href={`/bens/${bem.id}`} className="text-verde-escuro hover:underline">
                  {bem.tombamento}
                </Link>
              </TableCell>
              <TableCell>{bem.descricao}</TableCell>
              <TableCell className="text-sm">{bem.categoria}</TableCell>
              <TableCell className="text-sm">{bem.unidade}</TableCell>
              <TableCell className="text-sm">{bem.responsavel}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={estadoColors[bem.estadoConservacao]}>
                  {estadoLabels[bem.estadoConservacao]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={situacaoColors[bem.situacao]}>
                  {situacaoLabels[bem.situacao]}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {bem.valorAquisicao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
