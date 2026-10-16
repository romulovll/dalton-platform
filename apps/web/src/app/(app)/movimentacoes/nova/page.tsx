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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, ArrowLeftRight, XCircle, Wrench } from "lucide-react";
import { createTransferencia, createBaixa, createManutencao } from "@/lib/actions/movements";

interface Bem {
  id: string;
  tombamento: string;
  descricao: string;
}

interface Unidade {
  id: string;
  nome: string;
  codigo: string;
}

export default function NovaMovimentacaoPage() {
  const [bens, setBens] = useState<Bem[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    fetch("/api/form-data").then((r) => r.json()).then((data) => {
      setUnidades(data.unidades);
    });
    fetch("/api/bens-list").then((r) => r.json()).then((data) => {
      setBens(data);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/movimentacoes" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-texto-escuro">Nova Movimentação</h1>
          <p className="text-cinza-medio mt-1">Registrar transferência, baixa ou manutenção</p>
        </div>
      </div>

      <Tabs defaultValue="transferencia">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transferencia" className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Transferência
          </TabsTrigger>
          <TabsTrigger value="baixa" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Baixa
          </TabsTrigger>
          <TabsTrigger value="manutencao" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Manutenção
          </TabsTrigger>
        </TabsList>

        {/* Transferência */}
        <TabsContent value="transferencia">
          <form action={createTransferencia} className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Transferência de Bem</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Bem *</Label>
                  <Select name="bemId">
                    <SelectTrigger><SelectValue placeholder="Selecione o bem" /></SelectTrigger>
                    <SelectContent>
                      {bens.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.tombamento} — {b.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Transferência *</Label>
                  <Select name="tipo" defaultValue="TRANSFERENCIA_INTERNA">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRANSFERENCIA_INTERNA">Interna (entre setores)</SelectItem>
                      <SelectItem value="TRANSFERENCIA_UNIDADE">Entre Unidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Unidade de Destino</Label>
                  <Select name="unidadeDestinoId">
                    <SelectTrigger><SelectValue placeholder="Apenas para transferência entre unidades" /></SelectTrigger>
                    <SelectContent>
                      {unidades.map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localizacao">Nova Localização / Setor</Label>
                  <Input id="localizacao" name="localizacao" placeholder="Ex: Sala 02, Almoxarifado" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo *</Label>
                  <Textarea id="motivo" name="motivo" placeholder="Motivo da transferência..." rows={3} required />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-3">
              <Link href="/movimentacoes" className={cn(buttonVariants({ variant: "outline" }))}>Cancelar</Link>
              <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio">
                <Save className="mr-2 h-4 w-4" />Registrar Transferência
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Baixa */}
        <TabsContent value="baixa">
          <form action={createBaixa} className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Baixa de Bem</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Bem *</Label>
                  <Select name="bemId">
                    <SelectTrigger><SelectValue placeholder="Selecione o bem" /></SelectTrigger>
                    <SelectContent>
                      {bens.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.tombamento} — {b.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivo_baixa">Motivo da Baixa *</Label>
                  <Select name="motivo">
                    <SelectTrigger><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Doação">Doação</SelectItem>
                      <SelectItem value="Venda">Venda</SelectItem>
                      <SelectItem value="Furto/Roubo">Furto/Roubo</SelectItem>
                      <SelectItem value="Destruição">Destruição</SelectItem>
                      <SelectItem value="Obsolescência">Obsolescência</SelectItem>
                      <SelectItem value="Inservibilidade">Inservibilidade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc_baixa">Documento Autorizador</Label>
                  <Input id="doc_baixa" name="documento_autorizador" placeholder="Ata, resolução, B.O., etc." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="obs_baixa">Observações</Label>
                  <Textarea id="obs_baixa" name="observacoes" placeholder="Detalhes da baixa..." rows={3} />
                </div>

                <div className="rounded-lg bg-vermelho/5 border border-vermelho/20 p-4 text-sm text-vermelho">
                  A baixa altera permanentemente a situação do bem para "Baixado".
                  Esta ação deve ser autorizada pelo responsável.
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-3">
              <Link href="/movimentacoes" className={cn(buttonVariants({ variant: "outline" }))}>Cancelar</Link>
              <Button type="submit" className="bg-vermelho hover:bg-vermelho/80 text-white">
                <XCircle className="mr-2 h-4 w-4" />Registrar Baixa
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Manutenção */}
        <TabsContent value="manutencao">
          <form action={createManutencao} className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Manutenção de Bem</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Bem *</Label>
                  <Select name="bemId">
                    <SelectTrigger><SelectValue placeholder="Selecione o bem" /></SelectTrigger>
                    <SelectContent>
                      {bens.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.tombamento} — {b.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select name="tipo" defaultValue="MANUTENCAO_ENVIO">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANUTENCAO_ENVIO">Envio para Manutenção</SelectItem>
                      <SelectItem value="MANUTENCAO_RETORNO">Retorno de Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivo_manut">Descrição do Serviço *</Label>
                  <Textarea id="motivo_manut" name="motivo" placeholder="O que precisa ser consertado/feito..." rows={3} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="custo">Custo (R$)</Label>
                    <Input id="custo" name="custo_manutencao" type="number" step="0.01" min="0" placeholder="0,00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retorno_previsto">Retorno Previsto</Label>
                    <Input id="retorno_previsto" name="data_retorno_previsto" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retorno_real">Retorno Real</Label>
                    <Input id="retorno_real" name="data_retorno_real" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="obs_manut">Observações</Label>
                  <Textarea id="obs_manut" name="observacoes" placeholder="Detalhes adicionais..." rows={2} />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-3">
              <Link href="/movimentacoes" className={cn(buttonVariants({ variant: "outline" }))}>Cancelar</Link>
              <Button type="submit" className="bg-verde-escuro hover:bg-verde-medio">
                <Save className="mr-2 h-4 w-4" />Registrar Manutenção
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
