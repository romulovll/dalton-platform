"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Camera, Package, XCircle, CheckCircle, Loader2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IdentificationResult {
  item: string;
  descricao: string;
  deveRegistrar: boolean;
  motivo: string;
  categoria: string;
  vidaUtil: string;
  valorEstimado: string;
  conservacao: string;
}

export default function IdentificarBemPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setAnalyzing(true);

    try {
      const fd = new FormData();
      fd.append("foto", file);
      const res = await fetch("/api/identificar-bem", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao analisar");
        return;
      }
      setResult(data);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setAnalyzing(false);
    }
  }

  function reset() {
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/bens" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Identificar Item</h1>
          <p className="text-cinza-medio mt-1">Tire uma foto e descubra se deve ser registrado como patrimônio</p>
        </div>
      </div>

      {/* Camera / Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-verde-medio" />
            Foto do Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />

          {!preview ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-10 text-center">
              <Camera className="mx-auto h-12 w-12 text-cinza-medio mb-3" />
              <p className="text-sm text-cinza-medio mb-4">
                Tire uma foto do item ou selecione da galeria
              </p>
              <Button onClick={() => fileRef.current?.click()} className="bg-verde-escuro hover:bg-verde-medio">
                <Camera className="mr-2 h-4 w-4" />
                Tirar Foto / Selecionar
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-gray-100 max-h-[400px] flex items-center justify-center">
                <Image
                  src={preview}
                  alt="Item fotografado"
                  width={600}
                  height={400}
                  className="object-contain max-h-[400px]"
                  unoptimized
                />
              </div>
              {analyzing && (
                <div className="flex items-center justify-center gap-3 py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-verde-escuro" />
                  <p className="text-sm font-medium text-verde-escuro">Analisando item com inteligência artificial...</p>
                </div>
              )}
              {!analyzing && !result && !error && (
                <Button onClick={reset} variant="outline" className="w-full">
                  Tirar outra foto
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <XCircle className="mx-auto h-8 w-8 mb-2" />
              <p>{error}</p>
              <Button onClick={reset} variant="outline" className="mt-4">Tentar novamente</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {result.deveRegistrar ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              {result.item}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Register or not */}
            <div className={`rounded-lg p-4 ${result.deveRegistrar ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <p className={`font-semibold ${result.deveRegistrar ? "text-green-800" : "text-red-800"}`}>
                {result.deveRegistrar ? "✓ Deve ser registrado como bem patrimonial" : "✗ Não precisa ser registrado (material de consumo)"}
              </p>
              <p className={`text-sm mt-1 ${result.deveRegistrar ? "text-green-700" : "text-red-700"}`}>
                {result.motivo}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-cinza-medio">Descrição</p>
                <p className="text-sm font-medium">{result.descricao}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-cinza-medio">Categoria Sugerida</p>
                <Badge variant="secondary" className="bg-verde-escuro/10 text-verde-escuro mt-1">
                  {result.categoria}
                </Badge>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-cinza-medio">Vida Útil Estimada</p>
                <p className="text-sm font-medium">{result.vidaUtil}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-cinza-medio">Valor Estimado</p>
                <p className="text-sm font-medium">{result.valorEstimado}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-cinza-medio">Estado de Conservação</p>
                <p className="text-sm font-medium">{result.conservacao}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={reset} variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Identificar outro
              </Button>
              {result.deveRegistrar && (
                <Link href="/bens/novo">
                  <Button className="bg-verde-escuro hover:bg-verde-medio">
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar este bem
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
