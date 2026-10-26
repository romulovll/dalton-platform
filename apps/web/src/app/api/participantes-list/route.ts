import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const participantes = await prisma.participante.findMany({
    where: { situacao: "ATIVO" },
    select: { id: true, nome: true },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json(participantes);
}
