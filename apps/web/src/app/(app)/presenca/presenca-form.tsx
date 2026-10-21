"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users2, Save, CheckSquare } from "lucide-react";
import { salvarPresenca } from "@/lib/actions/presenca";

interface SaudeRecord {
  temAlergiaRemedio: boolean;
  temMedicacaoRegular: boolean;
  temProblemasSaude: boolean;
  descricaoAlergiaRemedio?: string | null;
  descricaoMedicacaoRegular?: string | null;
  descricaoProblemasSaude?: string | null;
}

interface PresencaRecord {
  participanteId: string;
  nome: string;
  fotoUrl: string | null;
  saude: SaudeRecord | null;
  presente: boolean;
  observacao: string;
}

interface PresencaFormProps {
  atividadeId: string;
  data: string;
  atividadeNome?: string;
  initialRecords: PresencaRecord[];
}

export function PresencaForm({
  atividadeId,
  data,
  atividadeNome,
  initialRecords,
}: PresencaFormProps) {
  const [records, setRecords] = useState<PresencaRecord[]>(
    initialRecords.map((r) => ({ ...r }))
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function togglePresente(participanteId: string) {
    setRecords((prev) =>
      prev.map((r) =>
        r.participanteId === participanteId ? { ...r, presente: !r.presente } : r
      )
    );
    setSaved(false);
  }

  function setObservacao(participanteId: string, value: string) {
    setRecords((prev) =>
      prev.map((r) =>
        r.participanteId === participanteId ? { ...r, observacao: value } : r
      )
    );
    setSaved(false);
  }

  function marcarTodos() {
    const allPresent = records.every((r) => r.presente);
    setRecords((prev) => prev.map((r) => ({ ...r, presente: !allPresent })));
    setSaved(false);
  }

  function handleSalvar() {
    startTransition(async () => {
      await salvarPresenca(
        atividadeId,
        data,
        records.map((r) => ({
          participanteId: r.participanteId,
          presente: r.presente,
          observacao: r.observacao,
        }))
      );
      setSaved(true);
    });
  }

  const presenteCount = records.filter((r) => r.presente).length;
  const dataFormatada = new Date(data + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users2 className="h-5 w-5 text-verde-medio" />
            {atividadeNome ?? "Atividade"} — {dataFormatada}
          </CardTitle>
          <span className="text-sm text-cinza-medio">
            {presenteCount} / {records.length} presentes
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {records.length === 0 ? (
          <div className="text-center py-8 text-cinza-medio">
            Nenhum participante inscrito nesta atividade.
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={marcarTodos}
                disabled={isPending}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                {records.every((r) => r.presente) ? "Desmarcar Todos" : "Marcar Todos"}
              </Button>

              {saved && (
                <span className="text-sm text-green-600 font-medium">
                  Presença salva com sucesso.
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-cinza-medio">
                    <th className="text-left py-2 pr-4 font-medium">Nome</th>
                    <th className="text-left py-2 pr-4 font-medium">Alertas</th>
                    <th className="text-center py-2 pr-4 font-medium">Presente</th>
                    <th className="text-left py-2 font-medium">Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.participanteId} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4 font-medium text-texto-escuro">
                        {r.nome}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1">
                          {r.saude?.temAlergiaRemedio && (
                            <span
                              title="Alergia a remédio"
                              className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block"
                            />
                          )}
                          {r.saude?.temMedicacaoRegular && (
                            <span
                              title="Medicação regular"
                              className="h-2.5 w-2.5 rounded-full bg-orange-400 inline-block"
                            />
                          )}
                          {r.saude?.temProblemasSaude && (
                            <span
                              title="Problemas de saúde"
                              className="h-2.5 w-2.5 rounded-full bg-yellow-400 inline-block"
                            />
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.presente}
                          onChange={() => togglePresente(r.participanteId)}
                          disabled={isPending}
                          className="h-4 w-4 rounded border-gray-300 text-verde-escuro focus:ring-verde-medio cursor-pointer"
                        />
                      </td>
                      <td className="py-3">
                        <Input
                          value={r.observacao}
                          onChange={(e) => setObservacao(r.participanteId, e.target.value)}
                          placeholder="Observação..."
                          disabled={isPending}
                          className="h-8 text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={handleSalvar}
                disabled={isPending}
                className="bg-verde-escuro hover:bg-verde-medio"
              >
                <Save className="mr-2 h-4 w-4" />
                {isPending ? "Salvando..." : "Salvar Presença"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
