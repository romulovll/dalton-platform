"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { createInventario } from "@/lib/actions/inventory";

export default function NovoInventarioPage() {
  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await createInventario(formData);
    },
    null
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/inventarios">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Novo Inventário</h1>
          <p className="text-cinza-medio mt-1">Iniciar levantamento patrimonial</p>
        </div>
      </div>

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Inventário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              Ao iniciar um inventário, todos os bens ativos serão incluídos automaticamente
              para verificação. Cada bem deverá ser conferido e marcado como
              <strong> Localizado</strong>, <strong>Não Localizado</strong> ou <strong>Divergente</strong>.
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                placeholder="Motivo do inventário, período de referência, etc."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/inventarios">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio" disabled={isPending}>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Iniciar Inventário
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
