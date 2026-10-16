"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { createSetor } from "@/lib/actions/units";
import { useRouter } from "next/navigation";

export function AddSetorForm({ unidadeId }: { unidadeId: string }) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    await createSetor(unidadeId, nome.trim());
    setNome("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Setor
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
      <Input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do setor"
        className="max-w-xs"
        autoFocus
      />
      <Button type="submit" size="sm" className="bg-verde-escuro hover:bg-verde-medio">
        Salvar
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => { setOpen(false); setNome(""); }}>
        Cancelar
      </Button>
    </form>
  );
}
