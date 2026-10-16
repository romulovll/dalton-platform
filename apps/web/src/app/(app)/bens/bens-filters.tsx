"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRef } from "react";

interface FilterOption {
  id: string;
  nome: string;
}

interface FilterValues {
  search: string;
  categoriaId: string;
  unidadeId: string;
  situacao: string;
}

export function BensFilters({
  categorias,
  unidades,
  current,
}: {
  categorias: FilterOption[];
  unidades: FilterOption[];
  current: FilterValues;
}) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout>(null);

  function navigate(updates: Partial<FilterValues>) {
    const merged = { ...current, ...updates, page: "" };
    const parts: string[] = [];
    if (merged.search) parts.push(`search=${encodeURIComponent(merged.search)}`);
    if (merged.categoriaId) parts.push(`categoriaId=${merged.categoriaId}`);
    if (merged.unidadeId) parts.push(`unidadeId=${merged.unidadeId}`);
    if (merged.situacao) parts.push(`situacao=${merged.situacao}`);
    router.push(`/bens${parts.length ? `?${parts.join("&")}` : ""}`);
  }

  function handleSearch(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => navigate({ search: value }), 400);
  }

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-cinza-medio" />
        <Input
          className="pl-9"
          placeholder="Buscar tombamento, descrição ou marca..."
          defaultValue={current.search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <select
        className="border rounded-md px-3 py-2 text-sm"
        value={current.categoriaId}
        onChange={(e) => navigate({ categoriaId: e.target.value })}
      >
        <option value="">Todas as categorias</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>{c.nome}</option>
        ))}
      </select>
      <select
        className="border rounded-md px-3 py-2 text-sm"
        value={current.unidadeId}
        onChange={(e) => navigate({ unidadeId: e.target.value })}
      >
        <option value="">Todas as unidades</option>
        {unidades.map((u) => (
          <option key={u.id} value={u.id}>{u.nome}</option>
        ))}
      </select>
      <select
        className="border rounded-md px-3 py-2 text-sm"
        value={current.situacao}
        onChange={(e) => navigate({ situacao: e.target.value })}
      >
        <option value="">Todas as situações</option>
        <option value="ATIVO">Ativo</option>
        <option value="EM_MANUTENCAO">Em Manutenção</option>
        <option value="CEDIDO">Cedido</option>
        <option value="BAIXADO">Baixado</option>
        <option value="DESAPARECIDO">Desaparecido</option>
      </select>
    </div>
  );
}
