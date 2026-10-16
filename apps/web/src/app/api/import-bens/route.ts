import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import {
  FormaAquisicao,
  OrigemRecurso,
  EstadoConservacao,
} from "@prisma/client";

interface ImportRow {
  descricao: string;
  categoria: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  localizacao: string;
  responsavel: string;
  data_aquisicao: string;
  valor_aquisicao: string;
  forma_aquisicao: string;
  origem_recurso: string;
  estado_conservacao: string;
  nota_fiscal: string;
  fornecedor: string;
  observacoes: string;
}

const formaMap: Record<string, FormaAquisicao> = {
  compra: "COMPRA",
  "doação": "DOACAO",
  doacao: "DOACAO",
  "cessão": "CESSAO",
  cessao: "CESSAO",
  comodato: "COMODATO",
  "transferência": "TRANSFERENCIA",
  transferencia: "TRANSFERENCIA",
};

const origemMap: Record<string, OrigemRecurso> = {
  "próprio": "PROPRIO",
  proprio: "PROPRIO",
  "recursos próprios": "PROPRIO",
  "parceria pública": "PARCERIA_PUBLICA",
  "parceria publica": "PARCERIA_PUBLICA",
  "doação": "DOACAO",
  doacao: "DOACAO",
};

const estadoMap: Record<string, EstadoConservacao> = {
  excelente: "EXCELENTE",
  bom: "BOM",
  regular: "REGULAR",
  ruim: "RUIM",
  "inservível": "INSERVIVEL",
  inservivel: "INSERVIVEL",
};

function parseDate(s: string): Date {
  // Try dd/mm/yyyy
  const brMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) return new Date(`${brMatch[3]}-${brMatch[2].padStart(2, "0")}-${brMatch[1].padStart(2, "0")}`);
  // Try yyyy-mm-dd
  return new Date(s);
}

function parseNumber(s: string): number {
  // Handle pt-BR: "1.500,00" or "1500,00"
  const cleaned = s.replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { rows } = (await request.json()) as { rows: ImportRow[] };
  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: "Nenhum dado" }, { status: 400 });
  }
  if (rows.length > 1000) {
    return NextResponse.json({ error: "Máximo de 1000 registros por importação" }, { status: 400 });
  }

  const org = await prisma.organizacao.findFirst();
  if (!org) {
    return NextResponse.json({ error: "Organização não encontrada" }, { status: 500 });
  }

  // Get default unit
  const defaultUnit = await prisma.unidade.findFirst({ where: { situacao: "ATIVA" } });
  if (!defaultUnit) {
    return NextResponse.json({ error: "Nenhuma unidade ativa" }, { status: 500 });
  }

  // Get categories for mapping
  const categorias = await prisma.categoria.findMany();
  const catMap = new Map(categorias.map((c) => [c.nome.toLowerCase(), c.id]));
  const defaultCatId = categorias[0]?.id;

  const errors: string[] = [];
  let imported = 0;
  let nextTomb = org.proximoTombamento;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      if (!row.descricao) {
        errors.push(`Linha ${i + 1}: descrição vazia`);
        continue;
      }

      const tombamento = `${org.prefixoTombamento}-${String(nextTomb).padStart(6, "0")}`;
      const categoriaId = catMap.get(row.categoria.toLowerCase()) || defaultCatId;
      const valorAquisicao = parseNumber(row.valor_aquisicao) || 0;
      const dataAquisicao = row.data_aquisicao ? parseDate(row.data_aquisicao) : new Date();

      await prisma.bem.create({
        data: {
          tombamento,
          descricao: row.descricao,
          categoriaId,
          marca: row.marca || null,
          modelo: row.modelo || null,
          numeroSerie: row.numero_serie || null,
          unidadeAtualId: defaultUnit.id,
          localizacao: row.localizacao || null,
          responsavel: row.responsavel || "A definir",
          dataAquisicao: dataAquisicao,
          valorAquisicao: valorAquisicao,
          formaAquisicao: formaMap[row.forma_aquisicao.toLowerCase()] || "COMPRA",
          origemRecurso: origemMap[row.origem_recurso.toLowerCase()] || "PROPRIO",
          estadoConservacao: estadoMap[row.estado_conservacao.toLowerCase()] || "BOM",
          notaFiscal: row.nota_fiscal || null,
          fornecedor: row.fornecedor || null,
          observacoes: row.observacoes || null,
        },
      });

      nextTomb++;
      imported++;
    } catch (err) {
      errors.push(`Linha ${i + 1}: ${err instanceof Error ? err.message : "erro desconhecido"}`);
    }
  }

  // Update tombamento counter
  if (imported > 0) {
    await prisma.organizacao.update({
      where: { id: org.id },
      data: { proximoTombamento: nextTomb },
    });

    await logAudit({
      acao: "CREATE",
      entidade: "Bem",
      entidadeId: "import-batch",
      dados: { imported, total: rows.length },
    });
  }

  return NextResponse.json({ total: rows.length, imported, errors });
}
