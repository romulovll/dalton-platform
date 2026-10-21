export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users2 } from "lucide-react";
import { getParticipantes } from "@/lib/actions/participantes";
import { getUnidades } from "@/lib/actions/units";
import { ParticipantesFilters } from "./participantes-filters";

const situacaoConfig: Record<string, { label: string; className: string }> = {
  ATIVO: { label: "Ativo", className: "bg-green-100 text-green-800" },
  INATIVO: { label: "Inativo", className: "bg-gray-100 text-gray-800" },
  TRANSFERIDO: { label: "Transferido", className: "bg-blue-100 text-blue-800" },
};

function calcularIdade(dataNascimento: Date): number {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const m = hoje.getMonth() - dataNascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }
  return idade;
}

export default async function ParticipantesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    unidadeId?: string;
    situacao?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const pageSize = 30;

  const [allParticipantes, unidades] = await Promise.all([
    getParticipantes({
      search: params.search,
      unidadeId: params.unidadeId,
      situacao: params.situacao,
    }),
    getUnidades(),
  ]);

  const total = allParticipantes.length;
  const totalPages = Math.ceil(total / pageSize);
  const participantes = allParticipantes.slice((page - 1) * pageSize, page * pageSize);

  const hasFilters = params.search || params.unidadeId || params.situacao;

  function qs(p: number) {
    const parts: string[] = [];
    if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.unidadeId) parts.push(`unidadeId=${params.unidadeId}`);
    if (params.situacao) parts.push(`situacao=${params.situacao}`);
    parts.push(`page=${p}`);
    return `/participantes?${parts.join("&")}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Participantes</h1>
          <p className="text-cinza-medio mt-1">
            Cadastro de participantes do Instituto
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/participantes/novo"
            className={cn(buttonVariants({ variant: "default" }), "bg-verde-escuro hover:bg-verde-medio")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Participante
          </Link>
        </div>
      </div>

      {/* Filters */}
      <ParticipantesFilters
        unidades={unidades.map((u) => ({ id: u.id, nome: u.nome }))}
        current={{
          search: params.search ?? "",
          unidadeId: params.unidadeId ?? "",
          situacao: params.situacao ?? "",
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users2 className="h-5 w-5 text-verde-medio" />
            {total} {total === 1 ? "participante encontrado" : "participantes encontrados"}
            {hasFilters && (
              <Link
                href="/participantes"
                className="text-sm font-normal text-verde-medio hover:underline ml-2"
              >
                Limpar filtros
              </Link>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {participantes.length === 0 ? (
            <div className="text-center py-8 text-cinza-medio">
              {hasFilters ? (
                "Nenhum participante encontrado com os filtros aplicados."
              ) : (
                <>
                  Nenhum participante cadastrado.{" "}
                  <Link href="/participantes/novo" className="text-verde-medio underline">
                    Cadastrar o primeiro
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-cinza-medio">
                      <th className="text-left py-2 pr-4 font-medium">Nome</th>
                      <th className="text-left py-2 pr-4 font-medium">CPF</th>
                      <th className="text-left py-2 pr-4 font-medium">Data Nasc.</th>
                      <th className="text-left py-2 pr-4 font-medium">Unidade</th>
                      <th className="text-left py-2 pr-4 font-medium">Situação</th>
                      <th className="text-left py-2 pr-4 font-medium">Alertas</th>
                      <th className="text-right py-2 font-medium">Presenças</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantes.map((p) => {
                      const sit = situacaoConfig[p.situacao] ?? { label: p.situacao, className: "bg-gray-100 text-gray-800" };
                      const idade = calcularIdade(p.dataNascimento);
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
                          <td className="py-3 pr-4 text-cinza-medio">
                            {p.dataNascimento.toLocaleDateString("pt-BR")}{" "}
                            <span className="text-xs">({idade} anos)</span>
                          </td>
                          <td className="py-3 pr-4 text-cinza-medio">{p.unidade.nome}</td>
                          <td className="py-3 pr-4">
                            <Badge variant="secondary" className={sit.className}>
                              {sit.label}
                            </Badge>
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
                          <td className="py-3 text-right text-cinza-medio">
                            {p._count.presencas}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {page > 1 && (
                    <Link
                      href={qs(page - 1)}
                      className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                      Anterior
                    </Link>
                  )}
                  <span className="text-sm text-cinza-medio">
                    Página {page} de {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={qs(page + 1)}
                      className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                      Próxima
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
