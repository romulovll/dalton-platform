export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Activity, Users2, CheckCircle, XCircle } from "lucide-react";
import { getAtividades } from "@/lib/actions/atividades";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const publicoConfig: Record<string, { label: string; className: string }> = {
  CRIANCAS: { label: "Crianças", className: "bg-blue-100 text-blue-800" },
  IDOSOS: { label: "Idosos", className: "bg-purple-100 text-purple-800" },
  AMBOS: { label: "Ambos", className: "bg-green-100 text-green-800" },
};

export default async function AtividadesPage() {
  const session = await getSession();
  const atividades = await getAtividades();

  // Dashboard stats for the professor's activities
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const atividadeIds = atividades.map((a) => a.id);
  const [totalParticipantes, presencaHoje, ausenciaHoje] = await Promise.all([
    prisma.atividadeParticipante.count({ where: { atividadeId: { in: atividadeIds } } }),
    prisma.presenca.count({ where: { atividadeId: { in: atividadeIds }, data: hoje, presente: true } }),
    prisma.presenca.count({ where: { atividadeId: { in: atividadeIds }, data: hoje, presente: false } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Atividades</h1>
          <p className="text-cinza-medio mt-1">
            Atividades oferecidas pelo Instituto
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/atividades/nova"
            className={cn(buttonVariants({ variant: "default" }), "bg-verde-escuro hover:bg-verde-medio")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Atividade
          </Link>
        </div>
      </div>

      {/* Stats dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <Activity className="h-5 w-5 text-verde-medio mx-auto mb-1" />
            <p className="text-2xl font-bold text-texto-escuro">{atividades.length}</p>
            <p className="text-xs text-cinza-medio">Atividades</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <Users2 className="h-5 w-5 text-azul mx-auto mb-1" />
            <p className="text-2xl font-bold text-texto-escuro">{totalParticipantes}</p>
            <p className="text-xs text-cinza-medio">Participantes Inscritos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-600">{presencaHoje}</p>
            <p className="text-xs text-cinza-medio">Presentes Hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <XCircle className="h-5 w-5 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-500">{ausenciaHoje}</p>
            <p className="text-xs text-cinza-medio">Ausentes Hoje</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-verde-medio" />
            {atividades.length} {atividades.length === 1 ? "atividade encontrada" : "atividades encontradas"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {atividades.length === 0 ? (
            <div className="text-center py-8 text-cinza-medio">
              Nenhuma atividade cadastrada.{" "}
              <Link href="/atividades/nova" className="text-verde-medio underline">
                Cadastrar a primeira
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-cinza-medio">
                    <th className="text-left py-2 pr-4 font-medium">Nome</th>
                    <th className="text-left py-2 pr-4 font-medium">Público-alvo</th>
                    <th className="text-left py-2 pr-4 font-medium">Unidade</th>
                    <th className="text-left py-2 pr-4 font-medium">Professor</th>
                    <th className="text-right py-2 pr-4 font-medium">Participantes</th>
                    <th className="text-left py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {atividades.map((a) => {
                    const publico = publicoConfig[a.publicoAlvo] ?? { label: a.publicoAlvo, className: "bg-gray-100 text-gray-800" };
                    return (
                      <tr key={a.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4">
                          <Link
                            href={`/atividades/${a.id}`}
                            className="font-medium text-texto-escuro hover:text-verde-escuro hover:underline"
                          >
                            {a.nome}
                          </Link>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="secondary" className={publico.className}>
                            {publico.label}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-cinza-medio">
                          {a.unidade?.nome ?? "—"}
                        </td>
                        <td className="py-3 pr-4 text-cinza-medio">
                          {a.usuario?.nome ?? "—"}
                        </td>
                        <td className="py-3 pr-4 text-right text-cinza-medio">
                          {a._count.participantes}
                        </td>
                        <td className="py-3">
                          <Badge
                            variant="secondary"
                            className={a.ativa ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {a.ativa ? "Ativa" : "Inativa"}
                          </Badge>
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
    </div>
  );
}
