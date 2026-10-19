export const dynamic = "force-dynamic";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { FileBarChart, TrendingDown, Download, FileText, Printer } from "lucide-react";
import { getDepreciacaoReport, runDepreciacao } from "@/lib/actions/depreciation";
import { getNotasExplicativas } from "@/lib/actions/notas-explicativas";
import { prisma } from "@/lib/prisma";

const formaLabels: Record<string, string> = {
  COMPRA: "Compra",
  DOACAO: "Doação",
  CESSAO: "Cessão",
  COMODATO: "Comodato",
  TRANSFERENCIA: "Transferência",
};

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{ forma?: string }>;
}) {
  const params = await searchParams;
  const [allReport, totalBens, totalUnidades, notas] = await Promise.all([
    getDepreciacaoReport(),
    prisma.bem.count({ where: { situacao: { not: "BAIXADO" } } }),
    prisma.unidade.count({ where: { situacao: "ATIVA" } }),
    getNotasExplicativas(),
  ]);

  // Filter by forma de aquisição if set
  const report = params.forma
    ? allReport.filter((r) => r.formaAquisicao === params.forma)
    : allReport;

  const totalAquisicao = report.reduce((acc, r) => acc + r.valorAquisicao, 0);
  const totalDepreciacao = report.reduce((acc, r) => acc + r.depreciacaoAcumulada, 0);
  const totalContabil = report.reduce((acc, r) => acc + r.valorContabil, 0);

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Relatórios</h1>
          <p className="text-cinza-medio mt-1">
            Relatórios contábeis e de depreciação
          </p>
        </div>
        <div className="flex gap-2">
          <form action={async () => { "use server"; await runDepreciacao(); }}>
            <Button type="submit" variant="outline">
              <TrendingDown className="mr-2 h-4 w-4" />
              Calcular Depreciação Mensal
            </Button>
          </form>
          <Link href="/api/relatorio-csv" target="_blank">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </Link>
          <Link href="/api/relatorio-pdf" target="_blank">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir / PDF
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter by Forma de Aquisição */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-sm text-cinza-medio mr-1">Forma de Aquisição:</span>
        <Link
          href="/relatorios"
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${!params.forma ? "bg-verde-escuro text-white" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          Todas
        </Link>
        {Object.entries(formaLabels).map(([key, label]) => (
          <Link
            key={key}
            href={`/relatorios?forma=${key}`}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${params.forma === key ? "bg-verde-escuro text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-cinza-medio">Total de Bens Ativos</p>
            <p className="text-2xl font-bold text-texto-escuro">{totalBens}</p>
            <p className="text-xs text-cinza-medio">{totalUnidades} unidade{totalUnidades !== 1 ? "s" : ""}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-cinza-medio">Valor Total de Aquisição</p>
            <p className="text-2xl font-bold text-texto-escuro">R$ {fmt(totalAquisicao)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-cinza-medio">Depreciação Acumulada</p>
            <p className="text-2xl font-bold text-vermelho">R$ {fmt(totalDepreciacao)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-cinza-medio">Valor Contábil Líquido</p>
            <p className="text-2xl font-bold text-verde-escuro">R$ {fmt(totalContabil)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Depreciation table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-verde-medio" />
            Demonstrativo de Depreciação
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.length === 0 ? (
            <p className="text-center py-8 text-cinza-medio">Nenhum bem cadastrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tombamento</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Valor Aquisição</TableHead>
                    <TableHead className="text-right">Depreciação</TableHead>
                    <TableHead className="text-right">Valor Contábil</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-sm">
                        <Link href={`/bens/${r.id}`} className="text-verde-escuro hover:underline">
                          {r.tombamento}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{r.descricao}</TableCell>
                      <TableCell className="text-sm">{r.categoria}</TableCell>
                      <TableCell className="text-sm">{r.unidade}</TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {fmt(r.valorAquisicao)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-vermelho">
                        {fmt(r.depreciacaoAcumulada)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium text-verde-escuro">
                        {fmt(r.valorContabil)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className={
                            r.percentualDepreciado >= 100
                              ? "bg-red-100 text-red-800"
                              : r.percentualDepreciado >= 50
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {r.percentualDepreciado.toFixed(0)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Notas Explicativas — ITG 2002 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-verde-medio" />
            Notas Explicativas (ITG 2002)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div>
            <h3 className="font-semibold text-sm text-texto-escuro mb-2">
              1. Resumo do Patrimônio
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="border rounded p-3">
                <p className="text-cinza-medio">Bens Ativos</p>
                <p className="font-semibold">{notas.resumo.bensAtivos}</p>
              </div>
              <div className="border rounded p-3">
                <p className="text-cinza-medio">Bens Baixados</p>
                <p className="font-semibold">{notas.resumo.baixados}</p>
              </div>
              <div className="border rounded p-3">
                <p className="text-cinza-medio">Com Cláusula de Inalienabilidade</p>
                <p className="font-semibold">{notas.resumo.inalienaveisCount}</p>
              </div>
              <div className="border rounded p-3">
                <p className="text-cinza-medio">Bens Remanescentes</p>
                <p className="font-semibold">{notas.resumo.remanescentesCount}</p>
              </div>
            </div>
          </div>

          {/* By category */}
          <div>
            <h3 className="font-semibold text-sm text-texto-escuro mb-2">
              2. Composição por Categoria e Critérios de Depreciação
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-center">Qtde</TableHead>
                    <TableHead className="text-center">Vida Útil</TableHead>
                    <TableHead className="text-center">Taxa Anual</TableHead>
                    <TableHead className="text-right">Valor Aquisição</TableHead>
                    <TableHead className="text-right">Depreciação Acum.</TableHead>
                    <TableHead className="text-right">Valor Contábil</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notas.porCategoria.map((c) => (
                    <TableRow key={c.categoria}>
                      <TableCell className="text-sm">{c.categoria}</TableCell>
                      <TableCell className="text-sm text-center">{c.quantidade}</TableCell>
                      <TableCell className="text-sm text-center">{c.vidaUtilAnos} anos</TableCell>
                      <TableCell className="text-sm text-center">{c.taxaAnual.toFixed(0)}%</TableCell>
                      <TableCell className="text-sm text-right font-mono">{fmt(c.valorAquisicao)}</TableCell>
                      <TableCell className="text-sm text-right font-mono text-vermelho">{fmt(c.depreciacaoAcumulada)}</TableCell>
                      <TableCell className="text-sm text-right font-mono font-medium">{fmt(c.valorAquisicao - c.depreciacaoAcumulada)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* By origin of resources */}
          <div>
            <h3 className="font-semibold text-sm text-texto-escuro mb-2">
              3. Origem dos Recursos
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Origem</TableHead>
                    <TableHead className="text-center">Qtde</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notas.porOrigem.map((o) => (
                    <TableRow key={o.origem}>
                      <TableCell className="text-sm">
                        {o.origem === "PROPRIO" ? "Recursos Próprios" : o.origem === "PARCERIA_PUBLICA" ? "Parceria Pública" : "Doação"}
                      </TableCell>
                      <TableCell className="text-sm text-center">{o.quantidade}</TableCell>
                      <TableCell className="text-sm text-right font-mono">{fmt(o.valor)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* By acquisition form */}
          <div>
            <h3 className="font-semibold text-sm text-texto-escuro mb-2">
              4. Forma de Aquisição
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Forma</TableHead>
                    <TableHead className="text-center">Qtde</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notas.porFormaAquisicao.map((f) => (
                    <TableRow key={f.forma}>
                      <TableCell className="text-sm">
                        {f.forma === "COMPRA" ? "Compra" : f.forma === "DOACAO" ? "Doação" : f.forma === "CESSAO" ? "Cessão" : f.forma === "COMODATO" ? "Comodato" : "Transferência"}
                      </TableCell>
                      <TableCell className="text-sm text-center">{f.quantidade}</TableCell>
                      <TableCell className="text-sm text-right font-mono">{fmt(f.valor)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Active partnerships */}
          {notas.parcerias.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm text-texto-escuro mb-2">
                5. Parcerias Vigentes (Lei 13.019/2014)
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Órgão</TableHead>
                      <TableHead className="text-center">Bens Vinculados</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notas.parcerias.map((p) => (
                      <TableRow key={p.numero}>
                        <TableCell className="text-sm font-mono">{p.numero}</TableCell>
                        <TableCell className="text-sm">{p.tipo}</TableCell>
                        <TableCell className="text-sm">{p.orgao}</TableCell>
                        <TableCell className="text-sm text-center">{p.bensVinculados}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="text-xs text-cinza-medio border-t pt-4">
            <p>
              <strong>Critérios contábeis:</strong> Depreciação calculada pelo método linear,
              com base na vida útil estimada por categoria de bem, conforme NBC TG 27 e ITG 2002 (R1).
              Bens adquiridos com recursos de parcerias públicas possuem cláusula de inalienabilidade
              conforme Art. 36 da Lei 13.019/2014.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
