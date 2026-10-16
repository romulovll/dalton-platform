"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function PhotoUpload({
  bemId,
  currentUrl,
}: {
  bemId: string;
  currentUrl: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("foto", file);
    formData.append("bemId", bemId);

    const res = await fetch("/api/upload", { method: "POST", body: formData });

    if (res.ok) {
      const { fotoUrl } = await res.json();
      setPreview(fotoUrl);
      router.refresh();
    }

    setUploading(false);
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border">
          <Image
            src={preview}
            alt="Foto do bem"
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-8 transition-colors hover:border-verde-medio/50">
          <div className="text-center">
            <Camera className="mx-auto h-8 w-8 text-cinza-medio mb-2" />
            <p className="text-sm text-cinza-medio">
              Clique para adicionar uma foto
            </p>
            <p className="text-xs text-cinza-medio mt-1">JPG, PNG até 5MB</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      )}

      {!preview && (
        <label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            className="w-full"
            onClick={() => {}}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Enviando..." : "Enviar Foto"}
          </Button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      )}
    </div>
  );
}
