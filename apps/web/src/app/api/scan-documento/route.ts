import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { scanPdfBuffer } from "@/lib/sensitive-scan";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("arquivo") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Arquivo é obrigatório" }, { status: 400 });
  }

  // Only scan PDFs
  if (file.type !== "application/pdf") {
    return NextResponse.json({ matches: [], message: "Verificação disponível apenas para PDFs." });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const matches = await scanPdfBuffer(buffer);

  return NextResponse.json({
    matches,
    hasSensitiveData: matches.some((m) => m.tipo !== "Aviso"),
    message: matches.length > 0
      ? `Encontrados ${matches.length} possíveis dados sensíveis. Verifique antes de publicar.`
      : "Nenhum dado sensível detectado.",
  });
}
