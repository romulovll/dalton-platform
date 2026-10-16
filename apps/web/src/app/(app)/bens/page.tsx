export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, Upload, FileDown } from "lucide-react";
import { getBens, getCategorias } from "@/lib/actions/assets";
import { getUnidades } from "@/lib/actions/units";
import { BensFilters } from "./bens-filters";
import { BensTable } from "./bens-table";

export default async function BensPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    categoriaId?: string;
    unidadeId?: string;
    situacao?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const pageSize = 30;

  const [allBens, categorias, unidades] = await Promise.all([
    getBens({
      search: params.search,
      categoriaId: params.categoriaId,
      unidadeId: params.unidadeId,
      situacao: params.situacao,
    }),
    getCategorias(),
    getUnidades(),
  ]);

  const total = allBens.length;
  const totalPages = Math.ceil(total / pageSize);
  const bens = allBens.slice((page - 1) * pageSize, page * pageSize);

  const hasFilters = params.search || params.categoriaId || params.unidadeId || params.situacao;

  // Build query string helper for pagination links
  function qs(p: number) {
    const parts: string[] = [];
    if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.categoriaId) parts.push(`categoriaId=${params.categoriaId}`);
    if (params.unidadeId) parts.push(`unidadeId=${params.unidadeId}`);
    if (params.situacao) parts.push(`situacao=${params.situacao}`);
    parts.push(`page=${p}`);
    return `/bens?${parts.join("&")}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Bens Patrimoniais</h1>
          <p className="text-cinza-medio mt-1">
            Controle de todos os bens do Instituto
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/api/ficha-cadastro" target="_blank" className={cn(buttonVariants({ variant: "outline" }))}>
            <FileDown className="mr-2 h-4 w-4" />
            Fichas de Cadastro
          </Link>
          <Link href="/bens/importar" className={cn(buttonVariants({ variant: "outline" }))}>
            <Upload className="mr-2 h-4 w-4" />
            Importar CSV
          </Link>
          <Link href="/bens/novo" className={cn(buttonVariants({ variant: "default" }), "bg-verde-escuro hover:bg-verde-medio")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Bem
          </Link>
        </div>
      </div>

      {/* Filters */}
      <BensFilters
        categorias={categorias.map((c) => ({ id: c.id, nome: c.nome }))}
        unidades={unidades.map((u) => ({ id: u.id, nome: u.nome }))}
        current={{
          search: params.search ?? "",
          categoriaId: params.categoriaId ?? "",
          unidadeId: params.unidadeId ?? "",
          situacao: params.situacao ?? "",
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-verde-medio" />
            {total} {total === 1 ? "bem encontrado" : "bens encontrados"}
            {hasFilters && (
              <Link href="/bens" className="text-sm font-normal text-verde-medio hover:underline ml-2">
                Limpar filtros
              </Link>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bens.length === 0 ? (
            <div className="text-center py-8 text-cinza-medio">
              {hasFilters ? "Nenhum bem encontrado com os filtros aplicados." : (
                <>
                  Nenhum bem cadastrado.{" "}
                  <Link href="/bens/novo" className="text-verde-medio underline">
                    Cadastrar o primeiro
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              <BensTable
                bens={bens.map((bem) => ({
                  id: bem.id,
                  tombamento: bem.tombamento,
                  descricao: bem.descricao,
                  categoria: bem.tipoItem?.nome || bem.categoria.nome,
                  unidade: bem.unidadeAtual.nome,
                  responsavel: bem.responsavel,
                  estadoConservacao: bem.estadoConservacao,
                  situacao: bem.situacao,
                  valorAquisicao: Number(bem.valorAquisicao),
                }))}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {page > 1 && (
                    <Link href={qs(page - 1)} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">
                      Anterior
                    </Link>
                  )}
                  <span className="text-sm text-cinza-medio">
                    Página {page} de {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link href={qs(page + 1)} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">
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
