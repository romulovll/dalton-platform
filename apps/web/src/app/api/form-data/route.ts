import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [categorias, unidades] = await Promise.all([
    prisma.categoria.findMany({
      orderBy: { nome: "asc" },
      select: {
        id: true,
        nome: true,
        vidaUtilAnos: true,
        tipos: { orderBy: { nome: "asc" }, select: { id: true, nome: true } },
      },
    }),
    prisma.unidade.findMany({
      where: { situacao: "ATIVA" },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, codigo: true },
    }),
  ]);

  return NextResponse.json({ categorias, unidades });
}
