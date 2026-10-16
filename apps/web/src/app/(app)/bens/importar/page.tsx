"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle, AlertTriangle } from "lucide-react";

interface ParsedRow {
  descricao: string;
  categoria: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  localizacao: string;
  responsavel: string;
  data_aquisicao: string;
  valor_aquisicao: string;
  forma_aquisicao: string;
  origem_recurso: string;
  estado_conservacao: string;
  nota_fiscal: string;
  fornecedor: string;
  observacoes: string;
}

interface ImportResult {
  total: number;
  imported: number;
  errors: string[];
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  // Detect delimiter
  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, "").toLowerCase());

  const columnMap: Record<string, string> = {
    descricao: "descricao",
    "descrição": "descricao",
    categoria: "categoria",
    marca: "marca",
    modelo: "modelo",
    "numero_serie": "numero_serie",
    "número série": "numero_serie",
    "serie": "numero_serie",
    localizacao: "localizacao",
    "localização": "localizacao",
    responsavel: "responsavel",
    "responsável": "responsavel",
    data_aquisicao: "data_aquisicao",
    "data aquisição": "data_aquisicao",
    "data de aquisição": "data_aquisicao",
    valor_aquisicao: "valor_aquisicao",
    "valor aquisição": "valor_aquisicao",
    valor: "valor_aquisicao",
    forma_aquisicao: "forma_aquisicao",
    "forma aquisição": "forma_aquisicao",
    origem_recurso: "origem_recurso",
    "origem recurso": "origem_recurso",
    "origem": "origem_recurso",
    estado_conservacao: "estado_conservacao",
    "estado conservação": "estado_conservacao",
    "estado": "estado_conservacao",
    nota_fiscal: "nota_fiscal",
    "nota fiscal": "nota_fiscal",
    fornecedor: "fornecedor",
    observacoes: "observacoes",
    "observações": "observacoes",
  };

  const indices: Record<string, number> = {};
  headers.forEach((h, i) => {
    const mapped = columnMap[h];
    if (mapped) indices[mapped] = i;
  });

  return lines.slice(1).map((line) => {
    const cols = line.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ""));
    const get = (key: string) => (indices[key] !== undefined ? cols[indices[key]] || "" : "");
    return {
      descricao: get("descricao"),
      categoria: get("categoria"),
      marca: get("marca"),
      modelo: get("modelo"),
      numero_serie: get("numero_serie"),
      localizacao: get("localizacao"),
      responsavel: get("responsavel"),
      data_aquisicao: get("data_aquisicao"),
      valor_aquisicao: get("valor_aquisicao"),
      forma_aquisicao: get("forma_aquisicao"),
      origem_recurso: get("origem_recurso"),
      estado_conservacao: get("estado_conservacao"),
      nota_fiscal: get("nota_fiscal"),
      fornecedor: get("fornecedor"),
      observacoes: get("observacoes"),
    };
  }).filter((r) => r.descricao);
}

export default function ImportarBensPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      // Remove BOM
      const clean = text.replace(/^\uFEFF/, "");
      setRows(parseCSV(clean));
    };
    reader.readAsText(file, "UTF-8");
  }

  async function handleImport() {
    if (rows.length === 0) return;
    setImporting(true);

    try {
      const res = await fetch("/api/import-bens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      setResult(data);
      if (data.imported > 0) {
        setTimeout(() => router.push("/bens"), 3000);
      }
    } catch {
      setResult({ total: rows.length, imported: 0, errors: ["Erro de conexão"] });
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/bens" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Importar Bens</h1>
          <p className="text-cinza-medio mt-1">Importar bens a partir de planilha CSV</p>
        </div>
      </div>

      {/* Upload area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-verde-medio" />
            Upload do Arquivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFile}
              className="hidden"
            />
            <FileSpreadsheet className="mx-auto h-10 w-10 text-cinza-medio mb-3" />
            <p className="text-sm text-cinza-medio mb-2">
              {fileName || "Arraste o arquivo CSV ou clique para selecionar"}
            </p>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              Selecionar Arquivo
            </Button>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">Formato esperado (CSV):</p>
            <p className="font-mono text-xs">
              Descrição;Categoria;Marca;Modelo;Responsável;Data Aquisição;Valor;Estado;Origem Recurso
            </p>
            <p className="mt-1 text-xs">
              Separador: vírgula ou ponto-e-vírgula. Codificação: UTF-8. A primeira linha deve conter os nomes das colunas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {rows.length > 0 && !result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pré-visualização ({rows.length} registros)</span>
              <Button
                className="bg-verde-escuro hover:bg-verde-medio"
                onClick={handleImport}
                disabled={importing}
              >
                <Upload className="mr-2 h-4 w-4" />
                {importing ? "Importando..." : `Importar ${rows.length} Bens`}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Data Aquisição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 50).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm text-cinza-medio">{i + 1}</TableCell>
                      <TableCell className="text-sm">{row.descricao}</TableCell>
                      <TableCell className="text-sm">{row.categoria || "—"}</TableCell>
                      <TableCell className="text-sm">{row.marca || "—"}</TableCell>
                      <TableCell className="text-sm">{row.responsavel || "—"}</TableCell>
                      <TableCell className="text-sm">{row.data_aquisicao || "—"}</TableCell>
                      <TableCell className="text-sm text-right">{row.valor_aquisicao || "—"}</TableCell>
                      <TableCell className="text-sm">{row.estado_conservacao || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {rows.length > 50 && (
                <p className="text-sm text-cinza-medio text-center mt-2">
                  Mostrando 50 de {rows.length} registros
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              {result.imported > 0 ? (
                <>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <p className="text-lg font-semibold text-green-700">
                    {result.imported} de {result.total} bens importados com sucesso!
                  </p>
                  <p className="text-sm text-cinza-medio">Redirecionando para a listagem...</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                  <p className="text-lg font-semibold text-red-700">Nenhum bem importado</p>
                </>
              )}
              {result.errors.length > 0 && (
                <div className="text-left mt-4 p-3 bg-red-50 rounded text-sm text-red-700">
                  <p className="font-medium mb-1">Erros:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.errors.slice(0, 10).map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
