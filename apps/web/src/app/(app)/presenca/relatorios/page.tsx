export const dynamic = "force-dynamic";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileBarChart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function RelatoriosPresencaPage({
  searchParams,
}: {
  searchParams: Promise<{ atividadeId?: string }>;
}) {
  const params = await searchParams;

  // Professors only see their own activities
  const session = await getSession();
  const atividadeWhere: Record<string, unknown> = { ativa: true };
  if (session?.perfil === "PROFESSOR") {
    atividadeWhere.usuarioId = session.userId;
  }

  const atividades = await prisma.atividade.findMany({
    where: atividadeWhere,
    orderBy: { nome: "asc" },
    include: {
      _count: { select: { participantes: true } },
      presencas: {
        select: { participanteId: true, presente: true, data: true },
      },
    },
  });

  // Calculate stats per activity
  const stats = atividades.map((a) => {
    const total = a.presencas.length;
    const presentes = a.presencas.filter((p) => p.presente).length;
    const taxa = total > 0 ? Math.round((presentes / total) * 100) : 0;
    const datas = new Set(a.presencas.map((p) => p.data.toISOString().split("T")[0]));
    return {
      id: a.id,
      nome: a.nome,
      inscritos: a._count.participantes,
      totalRegistros: total,
      presentes,
      ausentes: total - presentes,
      taxa,
      diasComChamada: datas.size,
    };
  });

  // Per-participant breakdown for selected activity
  let participanteStats: { nome: string; total: number; presentes: number; taxa: number }[] = [];
  let selectedName = "";

  if (params.atividadeId) {
    const atividade = await prisma.atividade.findUnique({
      where: { id: params.atividadeId },
      select: { nome: true },
    });
    selectedName = atividade?.nome || "";

    const presencas = await prisma.presenca.findMany({
      where: { atividadeId: params.atividadeId },
      include: { participante: { select: { nome: true } } },
    });

    const byParticipante = new Map<string, { nome: string; total: number; presentes: number }>();
    for (const p of presencas) {
      const key = p.participanteId;
      const existing = byParticipante.get(key) || { nome: p.participante.nome, total: 0, presentes: 0 };
      existing.total++;
      if (p.presente) existing.presentes++;
      byParticipante.set(key, existing);
    }

    participanteStats = Array.from(byParticipante.values())
      .map((p) => ({ ...p, taxa: p.total > 0 ? Math.round((p.presentes / p.total) * 100) : 0 }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link href="/presenca">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-texto-escuro">Relatórios de Presença</h1>
            <p className="text-cinza-medio mt-1">Frequência por atividade e participante</p>
          </div>
        </div>
        <Link href="/api/relatorio-presenca-csv" target="_blank">
          <Button variant="outline" size="sm">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Exportar CSV
          </Button>
        </Link>
      </div>

      {/* Summary per activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-verde-medio" />
            Resumo por Atividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atividade</TableHead>
                  <TableHead className="text-center">Inscritos</TableHead>
                  <TableHead className="text-center">Dias</TableHead>
                  <TableHead className="text-center">Presentes</TableHead>
                  <TableHead className="text-center">Ausentes</TableHead>
                  <TableHead className="text-center">Taxa</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.nome}</TableCell>
                    <TableCell className="text-center">{s.inscritos}</TableCell>
                    <TableCell className="text-center">{s.diasComChamada}</TableCell>
                    <TableCell className="text-center text-green-600">{s.presentes}</TableCell>
                    <TableCell className="text-center text-red-600">{s.ausentes}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={
                        s.taxa >= 80 ? "bg-green-100 text-green-800" :
                        s.taxa >= 50 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }>
                        {s.taxa}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/presenca/relatorios?atividadeId=${s.id}`}
                        className="text-sm text-verde-escuro hover:underline"
                      >
                        Detalhar
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Per-participant breakdown */}
      {params.atividadeId && participanteStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Frequência Individual — {selectedName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participante</TableHead>
                    <TableHead className="text-center">Total Chamadas</TableHead>
                    <TableHead className="text-center">Presentes</TableHead>
                    <TableHead className="text-center">Ausentes</TableHead>
                    <TableHead className="text-center">Taxa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participanteStats.map((p) => (
                    <TableRow key={p.nome}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell className="text-center">{p.total}</TableCell>
                      <TableCell className="text-center text-green-600">{p.presentes}</TableCell>
                      <TableCell className="text-center text-red-600">{p.total - p.presentes}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={
                          p.taxa >= 80 ? "bg-green-100 text-green-800" :
                          p.taxa >= 50 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {p.taxa}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
