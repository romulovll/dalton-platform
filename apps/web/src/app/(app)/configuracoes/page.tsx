import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Building2 } from "lucide-react";

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-texto-escuro">Configurações</h1>
        <p className="text-cinza-medio mt-1">
          Configurações gerais do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-verde-medio" />
            Dados da Organização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_org">Nome</Label>
              <Input
                id="nome_org"
                defaultValue="Instituto Dalton Salomão"
                readOnly
                className="bg-cinza-claro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavel_legal">Responsável Legal</Label>
              <Input
                id="responsavel_legal"
                placeholder="Nome do responsável legal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco_sede">Endereço da Sede</Label>
              <Input
                id="endereco_sede"
                defaultValue="Presidente Epitácio — SP"
              />
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold text-texto-escuro mb-3">
              Tombamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prefixo">Prefixo</Label>
                <Input
                  id="prefixo"
                  defaultValue="IDS"
                  readOnly
                  className="bg-cinza-claro font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proximo">Próximo Número</Label>
                <Input
                  id="proximo"
                  defaultValue="000001"
                  readOnly
                  className="bg-cinza-claro font-mono"
                />
              </div>
            </div>
            <p className="text-xs text-cinza-medio mt-2">
              Formato: IDS-000001 (prefixo fixo + sequencial global com 6 dígitos). O número é gerado automaticamente e nunca muda.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-verde-escuro hover:bg-verde-medio">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
