import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const GCS_BUCKET = process.env.GCS_BUCKET || "dalton-assets-uploads";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("foto") as File | null;
  const bemId = formData.get("bemId") as string | null;

  if (!file || !bemId) {
    return NextResponse.json(
      { error: "Foto e bemId são obrigatórios" },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Apenas imagens são permitidas" },
      { status: 400 }
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Arquivo deve ter no máximo 5MB" },
      { status: 400 }
    );
  }

  // Sanitize inputs to prevent path traversal
  const ALLOWED_EXTS = ["jpg", "jpeg", "png", "gif", "webp"];
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  if (!ALLOWED_EXTS.includes(ext)) {
    return NextResponse.json(
      { error: "Tipo de arquivo não permitido. Use: JPG, PNG, GIF ou WebP" },
      { status: 400 }
    );
  }
  const safeBemId = bemId.replace(/[^a-zA-Z0-9_-]/g, "");
  const filename = `bens/${safeBemId}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let fotoUrl: string;

  // Use GCS in production, local storage in development
  if (process.env.NODE_ENV === "production" || process.env.GCS_BUCKET) {
    const { Storage } = await import("@google-cloud/storage");
    const storage = new Storage();
    const bucket = storage.bucket(GCS_BUCKET);
    const blob = bucket.file(filename);

    await blob.save(buffer, {
      contentType: file.type,
      metadata: { cacheControl: "public, max-age=31536000" },
    });

    fotoUrl = `https://storage.googleapis.com/${GCS_BUCKET}/${filename}`;
  } else {
    // Local development fallback
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const localName = `${safeBemId}-${Date.now()}.${ext}`;
    await writeFile(path.join(uploadDir, localName), buffer);
    fotoUrl = `/uploads/${localName}`;
  }

  await prisma.bem.update({
    where: { id: bemId },
    data: { fotoUrl },
  });

  return NextResponse.json({ fotoUrl });
}
