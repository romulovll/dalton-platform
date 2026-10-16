"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Save, Camera } from "lucide-react";
import { ESTADOS_CONSERVACAO, SITUACOES_BEM, FORMAS_AQUISICAO, ORIGENS_RECURSO } from "@/lib/constants";

interface Categoria {
  id: string;
  nome: string;
  vidaUtilAnos: number;
  tipos: { id: string; nome: string }[];
}

interface Unidade {
  id: string;
  nome: string;
  codigo: string;
}

interface AssetData {
  tombamento: string;
  descricao: string;
  categoriaId: string;
  tipoItemId: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  unidadeId: string;
  localizacao: string;
  responsavel: string;
  dataAquisicao: string;
  valorAquisicao: string;
  formaAquisicao: string;
  notaFiscal: string;
  fornecedor: string;
  origemRecurso: string;
  numeroParceria: string;
  estadoConservacao: string;
  situacao: string;
  vidaUtilMeses: string;
  valorResidual: string;
  inalienabilidade: boolean;
  bemRemanescente: boolean;
  observacoes: string;
}

export function EditAssetForm({
  action,
  bem,
  backHref,
}: {
  action: (formData: FormData) => Promise<void>;
  bem: AssetData;
  backHref: string;
}) {
  const [categoriaId, setCategoriaId] = useState(bem.categoriaId);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    fetch("/api/form-data").then((r) => r.json()).then((data) => {
      setCategorias(data.categorias);
      setUnidades(data.unidades);
    });
  }, []);

  const categoria = categorias.find((c) => c.id === categoriaId);

  return (
    <form action={action} className="space-y-6">
      {/* Identificacao */}
      <Card>
        <CardHeader>
          <CardTitle>Identificacao do Bem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tombamento">Tombamento</Label>
            <Input
              id="tombamento"
              value={bem.tombamento}
              readOnly
              disabled
              className="font-mono bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidadeId">Unidade *</Label>
              <Select name="unidadeId" defaultValue={bem.unidadeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="localizacao">Setor / Localizacao *</Label>
              <Input id="localizacao" name="localizacao" placeholder="Ex: Secretaria, Sala 01" defaultValue={bem.localizacao} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descricao do Bem *</Label>
            <Input id="descricao" name="descricao" placeholder="Ex: Notebook Dell Latitude 5540" required defaultValue={bem.descricao} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoriaId">Categoria *</Label>
              <Select name="categoriaId" value={categoriaId} onValueChange={(val) => setCategoriaId(val ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipoItemId">Tipo de Item *</Label>
              <Select name="tipoItemId" defaultValue={bem.tipoItemId} disabled={!categoria}>
                <SelectTrigger>
                  <SelectValue placeholder={categoria ? "Selecione o tipo" : "Selecione a categoria primeiro"} />
                </SelectTrigger>
                <SelectContent>
                  {categoria?.tipos.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" name="marca" placeholder="Ex: Dell" defaultValue={bem.marca} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input id="modelo" name="modelo" placeholder="Ex: Latitude 5540" defaultValue={bem.modelo} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero_serie">Numero de Serie</Label>
              <Input id="numero_serie" name="numero_serie" placeholder="S/N" defaultValue={bem.numeroSerie} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aquisicao */}
      <Card>
        <CardHeader>
          <CardTitle>Dados de Aquisicao</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_aquisicao">Data de Aquisicao *</Label>
              <Input id="data_aquisicao" name="data_aquisicao" type="date" required defaultValue={bem.dataAquisicao} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor_aquisicao">Valor de Aquisicao (R$) *</Label>
              <Input id="valor_aquisicao" name="valor_aquisicao" type="number" step="0.01" min="0" placeholder="0,00" required defaultValue={bem.valorAquisicao} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="forma_aquisicao">Forma de Aquisicao *</Label>
              <Select name="forma_aquisicao" defaultValue={bem.formaAquisicao}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {FORMAS_AQUISICAO.map((f) => (
                    <SelectItem key={f.value} value={f.value.toUpperCase()}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nota_fiscal">Nota Fiscal / Documento</Label>
              <Input id="nota_fiscal" name="nota_fiscal" placeholder="Numero da NF" defaultValue={bem.notaFiscal} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input id="fornecedor" name="fornecedor" placeholder="Nome do fornecedor" defaultValue={bem.fornecedor} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origem_recurso">Origem dos Recursos *</Label>
              <Select name="origem_recurso" defaultValue={bem.origemRecurso}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {ORIGENS_RECURSO.map((o) => (
                    <SelectItem key={o.value} value={o.value.toUpperCase()}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero_parceria">No do Convenio/Parceria</Label>
              <Input id="numero_parceria" name="numero_parceria" placeholder="Quando adquirido com recursos publicos" defaultValue={bem.numeroParceria} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado e Responsavel */}
      <Card>
        <CardHeader>
          <CardTitle>Estado e Responsavel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsavel/Guardiao *</Label>
              <Input id="responsavel" name="responsavel" placeholder="Nome do responsavel" required defaultValue={bem.responsavel} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado_conservacao">Estado de Conservacao *</Label>
              <Select name="estado_conservacao" defaultValue={bem.estadoConservacao}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {ESTADOS_CONSERVACAO.map((e) => (
                    <SelectItem key={e.value} value={e.value.toUpperCase()}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="situacao">Situacao *</Label>
              <Select name="situacao" defaultValue={bem.situacao}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SITUACOES_BEM.map((s) => (
                    <SelectItem key={s.value} value={s.value.toUpperCase()}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vida_util">Vida Util Estimada (meses)</Label>
              <Input id="vida_util" name="vida_util" type="number" min="1"
                placeholder={categoria ? `Padrao: ${categoria.vidaUtilAnos * 12} meses` : "Selecione a categoria"}
                defaultValue={bem.vidaUtilMeses} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor_residual">Valor Residual (R$)</Label>
              <Input id="valor_residual" name="valor_residual" type="number" step="0.01" min="0" placeholder="0,00" defaultValue={bem.valorResidual} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conformidade Legal */}
      <Card>
        <CardHeader><CardTitle>Conformidade Legal</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <input type="checkbox" id="inalienabilidade" name="inalienabilidade"
                className="rounded border-gray-300 text-verde-medio focus:ring-verde-medio h-4 w-4"
                defaultChecked={bem.inalienabilidade} />
              <Label htmlFor="inalienabilidade" className="cursor-pointer">
                <span className="font-medium">Clausula de Inalienabilidade</span>
                <span className="block text-xs text-cinza-medio mt-0.5">
                  Obrigatorio para bens adquiridos com recursos de parceria (Lei 13.019/2014, Art. 36)
                </span>
              </Label>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <input type="checkbox" id="bem_remanescente" name="bem_remanescente"
                className="rounded border-gray-300 text-verde-medio focus:ring-verde-medio h-4 w-4"
                defaultChecked={bem.bemRemanescente} />
              <Label htmlFor="bem_remanescente" className="cursor-pointer">
                <span className="font-medium">Bem Remanescente</span>
                <span className="block text-xs text-cinza-medio mt-0.5">
                  Bem de natureza permanente adquirido com recursos da parceria (Lei 13.019/2014, Art. 2o)
                </span>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observacoes */}
      <Card>
        <CardHeader><CardTitle>Foto e Observacoes</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Foto do Bem</Label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-8 transition-colors hover:border-verde-medio/50">
              <div className="text-center">
                <Camera className="mx-auto h-8 w-8 text-cinza-medio mb-2" />
                <p className="text-sm text-cinza-medio">Arraste uma foto ou clique para selecionar</p>
                <p className="text-xs text-cinza-medio mt-1">JPG, PNG ate 5MB</p>
                <input type="file" accept="image/*" className="hidden" id="foto" name="foto" />
                <Button type="button" variant="outline" size="sm" className="mt-3"
                  onClick={() => document.getElementById("foto")?.click()}>
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observacoes</Label>
            <Textarea id="observacoes" name="observacoes" placeholder="Informacoes adicionais sobre o bem..." rows={3} defaultValue={bem.observacoes} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Link href={backHref} className={cn(buttonVariants({ variant: "outline" }))}>Cancelar</Link>
        <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio">
          <Save className="mr-2 h-4 w-4" />
          Salvar Alteracoes
        </Button>
      </div>
    </form>
  );
}
