"use client";

import { useState, useRef } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Save, FileText, AlertTriangle, ShieldCheck } from "lucide-react";
import { createDocumento } from "@/lib/actions/documentos";

interface ScanMatch {
  tipo: string;
  valor: string;
  contexto: string;
}

interface ScanResult {
  matches: ScanMatch[];
  hasSensitiveData: boolean;
  message: string;
}

const categorias = [
  { value: "BALANCO", label: "Balanço Patrimonial" },
  { value: "PRESTACAO_CONTAS", label: "Prestação de Contas" },
  { value: "ATA", label: "Ata de Reunião / Assembleia" },
  { value: "ESTATUTO", label: "Estatuto Social" },
  { value: "RELATORIO_ATIVIDADES", label: "Relatório de Atividades" },
  { value: "PARECER_FISCAL", label: "Parecer do Conselho Fiscal" },
  { value: "CERTIDAO", label: "Certidão / Certificado" },
  { value: "CONTRATO_PARCERIA", label: "Contrato / Termo de Parceria" },
  { value: "OUTRO", label: "Outro" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function NovoDocumentoPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ url: string; name: string; size: number } | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      if (fileInfo) {
        formData.set("arquivo_url", fileInfo.url);
        formData.set("nome_arquivo", fileInfo.name);
        formData.set("tamanho", fileInfo.size.toString());
      }
      await createDocumento(formData);
    },
    null
  );

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setScanResult(null);
    try {
      // Upload file
      const fd = new FormData();
      fd.append("arquivo", file);
      const res = await fetch("/api/upload-documento", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erro ao enviar arquivo");
        return;
      }
      setFileInfo({ url: data.arquivoUrl, name: data.nomeArquivo, size: data.tamanho });

      // Scan for sensitive data (PDFs only)
      if (file.type === "application/pdf") {
        setScanning(true);
        const scanFd = new FormData();
        scanFd.append("arquivo", file);
        const scanRes = await fetch("/api/scan-documento", { method: "POST", body: scanFd });
        if (scanRes.ok) {
          const scanData = await scanRes.json();
          setScanResult(scanData);
        }
        setScanning(false);
      }
    } catch {
      alert("Erro de conexão");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/documentos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Novo Documento</h1>
          <p className="text-cinza-medio mt-1">Adicionar documento ao Portal de Transparência</p>
        </div>
      </div>

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Dados do Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input id="titulo" name="titulo" placeholder="Ex: Balanço Patrimonial 2025" required />
              </div>

              <div className="space-y-2">
                <Label>Ano *</Label>
                <Select name="ano" defaultValue={currentYear.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select name="categoria" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Publicado</Label>
                <Select name="publicado" defaultValue="on">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">Sim — visível no portal público</SelectItem>
                    <SelectItem value="off">Não — somente interno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" name="descricao" placeholder="Breve descrição do documento..." rows={2} />
            </div>

            {/* File upload */}
            <div className="space-y-2">
              <Label>Arquivo *</Label>
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" onChange={handleFileUpload} className="hidden" />
                {fileInfo ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-8 w-8 text-verde-medio" />
                    <div className="text-left">
                      <p className="text-sm font-medium">{fileInfo.name}</p>
                      <p className="text-xs text-cinza-medio">{(fileInfo.size / 1024).toFixed(0)} KB — Enviado com sucesso</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-cinza-medio mb-2" />
                    <p className="text-sm text-cinza-medio mb-2">PDF, Word, Excel ou imagem (máx. 20MB)</p>
                    <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      {uploading ? "Enviando..." : "Selecionar Arquivo"}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* LGPD Scan Results */}
            {scanning && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Verificando dados sensíveis (LGPD)...
              </div>
            )}

            {scanResult && !scanning && (
              <div className={`rounded-lg border p-4 text-sm ${
                scanResult.hasSensitiveData
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-green-200 bg-green-50 text-green-800"
              }`}>
                <div className="flex items-center gap-2 font-medium mb-2">
                  {scanResult.hasSensitiveData ? (
                    <><AlertTriangle className="h-4 w-4" /> Dados Sensíveis Detectados (LGPD)</>
                  ) : (
                    <><ShieldCheck className="h-4 w-4" /> {scanResult.message}</>
                  )}
                </div>
                {scanResult.matches.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {scanResult.matches.map((m, i) => (
                      <div key={i} className="rounded bg-white/60 p-2 text-xs">
                        <span className="font-semibold">{m.tipo}:</span>{" "}
                        <span className="font-mono">{m.valor}</span>
                        <p className="text-gray-500 mt-0.5 truncate">...{m.contexto}...</p>
                      </div>
                    ))}
                    <p className="text-xs mt-2 font-medium">
                      Recomendação: remova ou redija esses dados antes de publicar o documento.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Link href="/documentos">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio" disabled={isPending || !fileInfo}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Documento
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
