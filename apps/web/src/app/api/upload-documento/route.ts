import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const GCS_BUCKET = process.env.GCS_BUCKET || "dalton-assets-uploads";

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

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "Arquivo deve ter no máximo 20MB" }, { status: 400 });
  }

  const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipo não permitido. Use PDF, imagem, Word ou Excel." },
      { status: 400 }
    );
  }

  const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
  const safeExt = ext.replace(/[^a-z0-9]/g, "");
  const filename = `documentos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let arquivoUrl: string;

  if (process.env.NODE_ENV === "production" || process.env.GCS_BUCKET) {
    const { Storage } = await import("@google-cloud/storage");
    const storage = new Storage();
    const bucket = storage.bucket(GCS_BUCKET);
    const blob = bucket.file(filename);

    await blob.save(buffer, {
      contentType: file.type,
      metadata: { cacheControl: "public, max-age=31536000" },
    });

    arquivoUrl = `https://storage.googleapis.com/${GCS_BUCKET}/${filename}`;
  } else {
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", "uploads", "documentos");
    await mkdir(uploadDir, { recursive: true });
    const localName = `${Date.now()}.${safeExt}`;
    await writeFile(path.join(uploadDir, localName), buffer);
    arquivoUrl = `/uploads/documentos/${localName}`;
  }

  return NextResponse.json({
    arquivoUrl,
    nomeArquivo: file.name,
    tamanho: file.size,
  });
}
