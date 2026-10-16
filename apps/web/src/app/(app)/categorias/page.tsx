export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tags, Clock, TrendingDown, Package } from "lucide-react";
import { getCategorias } from "@/lib/actions/assets";

export default async function CategoriasPage() {
  const categorias = await getCategorias();

  const totalTipos = categorias.reduce((acc, cat) => acc + cat.tipos.length, 0);
  const totalBens = categorias.reduce((acc, cat) => acc + cat._count.bens, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-texto-escuro">
          Categorias e Tipos de Bens
        </h1>
        <p className="text-cinza-medio mt-1">
          Categorias e tipos de item para classificação dos bens patrimoniais
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="rounded-lg bg-verde-escuro/10 p-2">
              <Tags className="h-5 w-5 text-verde-escuro" />
            </div>
            <div>
              <p className="text-2xl font-bold text-texto-escuro">{categorias.length}</p>
              <p className="text-xs text-cinza-medio">Categorias</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="rounded-lg bg-verde-medio/10 p-2">
              <Package className="h-5 w-5 text-verde-medio" />
            </div>
            <div>
              <p className="text-2xl font-bold text-texto-escuro">{totalTipos}</p>
              <p className="text-xs text-cinza-medio">Tipos de Item</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="rounded-lg bg-azul/10 p-2">
              <Package className="h-5 w-5 text-azul" />
            </div>
            <div>
              <p className="text-2xl font-bold text-texto-escuro">{totalBens}</p>
              <p className="text-xs text-cinza-medio">Bens Cadastrados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {categorias.map((cat) => (
          <Card key={cat.id} className="overflow-hidden">
            {/* Header with colored top bar */}
            <div className="h-1 bg-gradient-to-r from-verde-escuro to-verde-claro" />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-verde-escuro/10 p-1.5">
                    <Tags className="h-4 w-4 text-verde-escuro" />
                  </div>
                  <CardTitle className="text-base">{cat.nome}</CardTitle>
                </div>
                {cat._count.bens > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-verde-escuro/10 text-verde-escuro text-xs"
                  >
                    {cat._count.bens} {cat._count.bens === 1 ? "bem" : "bens"}
                  </Badge>
                )}
              </div>

              {/* Info row */}
              <div className="flex items-center gap-4 mt-2 text-xs text-cinza-medio">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Vida útil: {cat.vidaUtilAnos} anos
                </span>
                <span className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  Depreciação: {cat.taxaAnual}%/ano
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-xs font-medium text-cinza-medio uppercase tracking-wide mb-2">
                {cat.tipos.length} tipos de item
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cat.tipos.map((tipo) => (
                  <span
                    key={tipo.id}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs text-cinza-escuro shadow-sm"
                  >
                    {tipo.nome}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
