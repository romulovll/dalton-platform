export const dynamic = "force-dynamic";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Brain, Calendar, CheckCircle, XCircle, Users, AlertTriangle } from "lucide-react";
import { getAgenda, getEstatisticasPsi, updateStatusAgendamento } from "@/lib/actions/psicologia";

const statusConfig: Record<string, { label: string; className: string }> = {
  AGENDADO: { label: "Agendado", className: "bg-blue-100 text-blue-800" },
  REALIZADO: { label: "Realizado", className: "bg-green-100 text-green-800" },
  FALTA: { label: "Falta", className: "bg-red-100 text-red-800" },
  CANCELADO: { label: "Cancelado", className: "bg-gray-100 text-gray-800" },
  REAGENDADO: { label: "Reagendado", className: "bg-yellow-100 text-yellow-800" },
};

const tipoConfig: Record<string, string> = {
  INDIVIDUAL: "Individual",
  GRUPO: "Grupo",
  FAMILIA: "Família",
  ACOLHIMENTO: "Acolhimento",
};

export default async function PsicologiaPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; status?: string }>;
}) {
  const params = await searchParams;
  const hoje = new Date();

  // Default to current month
  const mesFiltro = params.mes || `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  const [ano, mes] = mesFiltro.split("-").map(Number);

  const [agenda, stats] = await Promise.all([
    getAgenda({ mes: mesFiltro, status: params.status }),
    getEstatisticasPsi(),
  ]);

  // Group by date
  const byDate = new Map<string, typeof agenda>();
  for (const a of agenda) {
    const dateKey = a.dataHora.toISOString().split("T")[0];
    const list = byDate.get(dateKey) || [];
    list.push(a);
    byDate.set(dateKey, list);
  }
  const sortedDates = Array.from(byDate.keys()).sort();

  const mesNome = new Date(ano, mes - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  // Previous/next month
  const prevDate = new Date(ano, mes - 2);
  const nextDate = new Date(ano, mes);
  const prevMes = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
  const nextMes = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Psicologia</h1>
          <p className="text-cinza-medio mt-1">
            Agenda de atendimentos psicológicos
          </p>
        </div>
        <Link
          href="/psicologia/novo"
          className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-verde-escuro hover:bg-verde-medio")}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Novo Agendamento
        </Link>
      </div>

      {/* Legal notice */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          <strong>Sigilo profissional:</strong> Este módulo registra apenas dados administrativos
          (agendamento e presença). Prontuários e anotações clínicas são de responsabilidade
          exclusiva do profissional (CFP 5/2025, LGPD Art. 11).
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-texto-escuro">{stats.agendadosHoje}</p>
            <p className="text-xs text-cinza-medio">Agendados Hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-600">{stats.realizadosMes}</p>
            <p className="text-xs text-cinza-medio">Realizados (mês)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <XCircle className="h-5 w-5 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-500">{stats.faltasMes}</p>
            <p className="text-xs text-cinza-medio">Faltas (mês)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <Users className="h-5 w-5 text-verde-medio mx-auto mb-1" />
            <p className="text-2xl font-bold text-texto-escuro">{stats.totalPessoas}</p>
            <p className="text-xs text-cinza-medio">Pessoas Atendidas (mês)</p>
          </CardContent>
        </Card>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Link href={`/psicologia?mes=${prevMes}`} className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm">
          ← Anterior
        </Link>
        <h2 className="text-lg font-semibold text-texto-escuro capitalize">{mesNome}</h2>
        <Link href={`/psicologia?mes=${nextMes}`} className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm">
          Próximo →
        </Link>
      </div>

      {/* Agenda grouped by date */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-verde-medio" />
            {agenda.length} atendimento{agenda.length !== 1 ? "s" : ""} em {mesNome}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {agenda.length === 0 ? (
            <div className="text-center py-8 text-cinza-medio">
              Nenhum atendimento agendado para este mês.
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map((dateKey) => {
                const items = byDate.get(dateKey)!;
                const dateLabel = new Date(dateKey + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
                return (
                  <div key={dateKey}>
                    <h3 className="text-sm font-semibold text-cinza-escuro mb-2 capitalize border-b pb-1">{dateLabel}</h3>
                    <div className="space-y-2">
                      {items.map((a) => {
                        const st = statusConfig[a.status];
                        return (
                          <div key={a.id} className="flex items-center gap-4 rounded-lg border p-3 hover:bg-gray-50">
                            <div className="text-center flex-shrink-0 w-14">
                              <p className="text-base font-bold text-texto-escuro">
                                {a.dataHora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                              <p className="text-xs text-cinza-medio">{a.duracao}min</p>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-texto-escuro text-sm">
                                {a.participante?.nome || a.nomePessoa || "Não identificado"}
                                {!a.participante && a.nomePessoa && (
                                  <span className="text-xs text-cinza-medio ml-1">(não cadastrado)</span>
                                )}
                              </p>
                              <p className="text-xs text-cinza-medio">
                                {tipoConfig[a.tipo]} {a.unidade ? `— ${a.unidade.nome}` : ""}
                              </p>
                            </div>
                            <Badge variant="secondary" className={st.className}>{st.label}</Badge>
                            {a.status === "AGENDADO" && (
                              <div className="flex gap-1">
                                <form action={async () => { "use server"; await updateStatusAgendamento(a.id, "REALIZADO"); }}>
                                  <button type="submit" className="p-1.5 rounded hover:bg-green-50" title="Realizado">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </button>
                                </form>
                                <form action={async () => { "use server"; await updateStatusAgendamento(a.id, "FALTA"); }}>
                                  <button type="submit" className="p-1.5 rounded hover:bg-red-50" title="Falta">
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  </button>
                                </form>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
