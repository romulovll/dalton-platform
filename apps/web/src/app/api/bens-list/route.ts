import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bens = await prisma.bem.findMany({
    where: { situacao: { not: "BAIXADO" } },
    orderBy: { tombamento: "asc" },
    select: { id: true, tombamento: true, descricao: true },
  });
  return NextResponse.json(bens);
}
