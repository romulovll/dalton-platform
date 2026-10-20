import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { requireProfile } from "@/lib/rbac";
import { CategoriaDocumento } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  await requireProfile("ADMIN_GERAL");

  const body = await request.json();
  const { id, titulo, descricao, categoria, ano, publicado } = body;

  if (!id || !titulo || !categoria || !ano) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  await prisma.documento.update({
    where: { id },
    data: {
      titulo,
      descricao: descricao || null,
      categoria: categoria as CategoriaDocumento,
      ano,
      publicado,
    },
  });

  return NextResponse.json({ ok: true });
}
