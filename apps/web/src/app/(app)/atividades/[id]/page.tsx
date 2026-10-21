export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Users2, UserPlus, CalendarCheck } from "lucide-react";
import {
  getAtividade,
  addParticipanteToAtividade,
  removeParticipanteFromAtividade,
  getParticipantesDisponiveis,
} from "@/lib/actions/atividades";

const publicoConfig: Record<string, { label: string; className: string }> = {
  CRIANCAS: { label: "Crianças", className: "bg-blue-100 text-blue-800" },
  IDOSOS: { label: "Idosos", className: "bg-purple-100 text-purple-800" },
  AMBOS: { label: "Ambos", className: "bg-green-100 text-green-800" },
};

export default async function AtividadeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [atividade, disponiveis] = await Promise.all([
    getAtividade(id),
    getParticipantesDisponiveis(id),
  ]);

  if (!atividade) notFound();

  const publico = publicoConfig[atividade.publicoAlvo] ?? {
    label: atividade.publicoAlvo,
    className: "bg-gray-100 text-gray-800",
  };

  async function handleAddParticipante(formData: FormData) {
    "use server";
    const participanteId = formData.get("participanteId") as string;
    await addParticipanteToAtividade(id, participanteId);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/atividades">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-texto-escuro">{atividade.nome}</h1>
            <p className="text-cinza-medio mt-1">
              {atividade.unidade?.nome ?? "Sem unidade"}
              {atividade.usuario ? ` — ${atividade.usuario.nome}` : ""}
            </p>
          </div>
        </div>
        <Link href={`/presenca?atividade=${id}`}>
          <Button className="bg-verde-escuro hover:bg-verde-medio">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Registrar Presença
          </Button>
        </Link>
      </div>

      {/* Activity details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-cinza-medio">Público-alvo</p>
            <div className="mt-1">
              <Badge variant="secondary" className={publico.className}>
                {publico.label}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-cinza-medio">Status</p>
            <div className="mt-1">
              <Badge
                variant="secondary"
                className={atividade.ativa ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
              >
                {atividade.ativa ? "Ativa" : "Inativa"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-cinza-medio">Participantes inscritos</p>
            <p className="text-lg font-semibold mt-1">{atividade.participantes.length}</p>
          </CardContent>
        </Card>
      </div>

      {atividade.descricao && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-cinza-medio mb-1">Descrição</p>
            <p className="text-sm">{atividade.descricao}</p>
          </CardContent>
        </Card>
      )}

      {/* Enrolled participants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users2 className="h-5 w-5 text-verde-medio" />
            Participantes Inscritos ({atividade.participantes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {atividade.participantes.length === 0 ? (
            <div className="text-center py-6 text-cinza-medio">
              Nenhum participante inscrito nesta atividade.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-cinza-medio">
                    <th className="text-left py-2 pr-4 font-medium">Nome</th>
                    <th className="text-left py-2 pr-4 font-medium">CPF</th>
                    <th className="text-left py-2 pr-4 font-medium">Alertas</th>
                    <th className="text-right py-2 font-medium">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {atividade.participantes.map(({ participante: p }) => {
                    async function handleRemove() {
                      "use server";
                      await removeParticipanteFromAtividade(id, p.id);
                    }
                    return (
                      <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4">
                          <Link
                            href={`/participantes/${p.id}`}
                            className="font-medium text-texto-escuro hover:text-verde-escuro hover:underline"
                          >
                            {p.nome}
                          </Link>
                        </td>
                        <td className="py-3 pr-4 text-cinza-medio font-mono text-xs">
                          {p.cpf ?? "—"}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1">
                            {p.saude?.temAlergiaRemedio && (
                              <span
                                title="Alergia a remédio"
                                className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block"
                              />
                            )}
                            {p.saude?.temMedicacaoRegular && (
                              <span
                                title="Medicação regular"
                                className="h-2.5 w-2.5 rounded-full bg-orange-400 inline-block"
                              />
                            )}
                            {p.saude?.temProblemasSaude && (
                              <span
                                title="Problemas de saúde"
                                className="h-2.5 w-2.5 rounded-full bg-yellow-400 inline-block"
                              />
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <form action={handleRemove}>
                            <Button
                              type="submit"
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Remover
                            </Button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add participant */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-verde-medio" />
            Adicionar Participante
          </CardTitle>
        </CardHeader>
        <CardContent>
          {disponiveis.length === 0 ? (
            <div className="text-center py-4 text-cinza-medio">
              Não há participantes ativos disponíveis para inscrição.
            </div>
          ) : (
            <form action={handleAddParticipante} className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <label htmlFor="participanteId" className="text-sm font-medium">
                  Participante
                </label>
                <Select name="participanteId" required>
                  <SelectTrigger id="participanteId">
                    <SelectValue placeholder="Selecione um participante" />
                  </SelectTrigger>
                  <SelectContent>
                    {disponiveis.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome}{p.cpf ? ` — ${p.cpf}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio">
                <UserPlus className="mr-2 h-4 w-4" />
                Inscrever
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
