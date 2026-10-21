export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";
import { getAtividades } from "@/lib/actions/atividades";
import { getPresencaDiaria } from "@/lib/actions/presenca";
import { PresencaForm } from "./presenca-form";

export default async function PresencaPage({
  searchParams,
}: {
  searchParams: Promise<{ atividade?: string; data?: string }>;
}) {
  const params = await searchParams;
  const { atividade: atividadeId, data } = params;

  const atividades = await getAtividades();

  const records =
    atividadeId && data ? await getPresencaDiaria(atividadeId, data) : null;

  const atividadeSelecionada = atividades.find((a) => a.id === atividadeId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Registro de Presença</h1>
          <p className="text-cinza-medio mt-1">
            Registre a frequência diária dos participantes
          </p>
        </div>
      </div>

      {/* Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-verde-medio" />
            Selecionar Atividade e Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="atividade" className="text-sm font-medium">
                Atividade
              </label>
              <select
                id="atividade"
                name="atividade"
                defaultValue={atividadeId ?? ""}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione uma atividade</option>
                {atividades.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="data" className="text-sm font-medium">
                Data
              </label>
              <input
                id="data"
                name="data"
                type="date"
                defaultValue={data ?? new Date().toISOString().split("T")[0]}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <button
              type="submit"
              className={cn(buttonVariants({ variant: "default" }), "bg-verde-escuro hover:bg-verde-medio")}
            >
              Carregar
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Attendance form */}
      {atividadeId && data && records ? (
        <PresencaForm
          atividadeId={atividadeId}
          data={data}
          atividadeNome={atividadeSelecionada?.nome}
          initialRecords={records}
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-cinza-medio">
            Selecione uma atividade e uma data para registrar a presença.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
