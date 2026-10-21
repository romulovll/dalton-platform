export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Activity } from "lucide-react";
import { getAtividades } from "@/lib/actions/atividades";

const publicoConfig: Record<string, { label: string; className: string }> = {
  CRIANCAS: { label: "Crianças", className: "bg-blue-100 text-blue-800" },
  IDOSOS: { label: "Idosos", className: "bg-purple-100 text-purple-800" },
  AMBOS: { label: "Ambos", className: "bg-green-100 text-green-800" },
};

export default async function AtividadesPage() {
  const atividades = await getAtividades();

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
