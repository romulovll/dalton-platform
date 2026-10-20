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
import { ArrowLeft, Upload, Save, FileText, ShieldCheck } from "lucide-react";
import { createDocumento } from "@/lib/actions/documentos";

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
  const [uploadStep, setUploadStep] = useState("");
  const [fileInfo, setFileInfo] = useState<{ url: string; name: string; size: number } | null>(null);
  const [redactionInfo, setRedactionInfo] = useState<{
    redacted: boolean;
    redactions: { tipo: string; masked: string }[];
  } | null>(null);

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
    setUploadStep("Enviando arquivo...");
    setRedactionInfo(null);
    setFileInfo(null);
    try {
      const fd = new FormData();
      fd.append("arquivo", file);

      // Show progress steps
      const isPdf = file.type === "application/pdf";
      if (isPdf) {
        setTimeout(() => setUploadStep("Enviando arquivo para o servidor..."), 0);
        setTimeout(() => setUploadStep("Lendo documento com OCR..."), 5000);
        setTimeout(() => setUploadStep("Analisando dados sensíveis (IA)..."), 15000);
        setTimeout(() => setUploadStep("Gerando versão redijida..."), 30000);
        setTimeout(() => setUploadStep("Finalizando processamento..."), 60000);
      }

      const res = await fetch("/api/upload-documento", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erro ao enviar arquivo");
        return;
      }
      setFileInfo({ url: data.arquivoUrl, name: data.nomeArquivo, size: data.tamanho });

      if (data.redacted) {
        setRedactionInfo({
          redacted: true,
          redactions: data.redactions.map((r: { tipo: string; masked: string }) => ({
            tipo: r.tipo,
            masked: r.masked,
          })),
        });
      }
    } catch {
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setUploading(false);
      setUploadStep("");
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
                {uploading ? (
                  <div className="py-4">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="h-6 w-6 border-3 border-verde-escuro border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-medium text-verde-escuro">{uploadStep}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-verde-escuro h-1.5 rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                    <p className="text-xs text-cinza-medio mt-2">
                      PDFs escaneados podem levar até 2 minutos (OCR + análise LGPD)
                    </p>
                  </div>
                ) : fileInfo ? (
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
                    <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                      Selecionar Arquivo
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* LGPD Redaction Results */}
            {redactionInfo?.redacted && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
                <div className="flex items-center gap-2 font-medium mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  Dados sensíveis detectados e mascarados automaticamente (LGPD)
                </div>
                <p className="text-xs text-orange-700 mb-3">
                  O sistema gerou uma versão redijida do documento para publicação.
                  O original foi armazenado em pasta separada (acesso restrito).
                </p>
                <div className="space-y-1.5">
                  {redactionInfo.redactions.map((r, i) => (
                    <div key={i} className="rounded bg-white/60 px-2 py-1 text-xs flex items-center gap-2">
                      <span className="font-semibold text-orange-800">{r.tipo}:</span>
                      <span className="font-mono">{r.masked}</span>
                      <span className="text-orange-400">→ ***</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fileInfo && !redactionInfo?.redacted && !uploading && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Nenhum dado sensível detectado no documento.
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
