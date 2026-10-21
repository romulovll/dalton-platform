export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pencil,
  Users2,
  Heart,
  AlertTriangle,
  GraduationCap,
  Home,
  Phone,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { getParticipante } from "@/lib/actions/participantes";

const situacaoConfig: Record<string, { label: string; className: string }> = {
  ATIVO: { label: "Ativo", className: "bg-green-100 text-green-800" },
  INATIVO: { label: "Inativo", className: "bg-gray-100 text-gray-800" },
  TRANSFERIDO: { label: "Transferido", className: "bg-blue-100 text-blue-800" },
};

function calcularIdade(dataNascimento: Date): number {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const m = hoje.getMonth() - dataNascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }
  return idade;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-cinza-medio mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-cinza-medio">{label}</p>
        <p className="text-sm text-texto-escuro">{value}</p>
      </div>
    </div>
  );
}

function BoolRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div
        className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${value ? "bg-red-500" : "bg-cinza-medio/30"}`}
      />
      <span className="text-sm text-texto-escuro">{label}</span>
    </div>
  );
}

export default async function ParticipanteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const participante = await getParticipante(id);

  if (!participante) notFound();

  const sit =
    situacaoConfig[participante.situacao] ?? {
      label: participante.situacao,
      className: "bg-gray-100 text-gray-800",
    };

  const idade = calcularIdade(participante.dataNascimento);
  const temAlerta =
    participante.saude?.temAlergiaRemedio ||
    participante.saude?.temMedicacaoRegular ||
    participante.saude?.temProblemasSaude;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/participantes"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-texto-escuro">{participante.nome}</h1>
              <Badge variant="secondary" className={sit.className}>
                {sit.label}
              </Badge>
              {temAlerta && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Alerta de Saúde
                </Badge>
              )}
            </div>
            <p className="text-cinza-medio mt-1">
              {participante.unidade.nome} · {idade} anos
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/participantes/${id}/editar`}
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-verde-medio" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow icon={User} label="CPF" value={participante.cpf} />
            <InfoRow icon={User} label="RG" value={participante.rg} />
            <InfoRow
              icon={Calendar}
              label="Data de Nascimento"
              value={`${participante.dataNascimento.toLocaleDateString("pt-BR")} (${idade} anos)`}
            />
            <InfoRow icon={Phone} label="Telefone" value={participante.telefone} />
            <InfoRow icon={MapPin} label="Endereço" value={participante.endereco} />
            <InfoRow icon={Users2} label="Unidade" value={participante.unidade.nome} />
          </CardContent>
        </Card>

        {/* Responsáveis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users2 className="h-4 w-4 text-verde-medio" />
              Responsáveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {participante.responsaveis.length === 0 ? (
              <p className="text-sm text-cinza-medio py-2">Nenhum responsável cadastrado.</p>
            ) : (
              <div className="space-y-3">
                {participante.responsaveis.map((r) => (
                  <div key={r.id} className="rounded-lg border p-3 space-y-1">
                    <p className="text-sm font-medium text-texto-escuro">{r.nome ?? "—"}</p>
                    {r.parentesco && (
                      <p className="text-xs text-cinza-medio">{r.parentesco}</p>
                    )}
                    {r.telefone && (
                      <p className="text-xs text-cinza-medio flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {r.telefone}
                      </p>
                    )}
                    {r.trabalho && (
                      <p className="text-xs text-cinza-medio">Trabalho: {r.trabalho}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saúde */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-verde-medio" />
              Saúde
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {participante.saude ? (
              <>
                <BoolRow
                  label="Tem problemas de saúde"
                  value={participante.saude.temProblemasSaude}
                />
                {participante.saude.descricaoProblemasSaude && (
                  <p className="text-xs text-cinza-medio pl-5 pb-1">
                    {participante.saude.descricaoProblemasSaude}
                  </p>
                )}
                <BoolRow
                  label="Tem deficiência"
                  value={participante.saude.temDeficiencia}
                />
                {participante.saude.descricaoDeficiencia && (
                  <p className="text-xs text-cinza-medio pl-5 pb-1">
                    {participante.saude.descricaoDeficiencia}
                  </p>
                )}
                <BoolRow
                  label="Tem alergia a remédio"
                  value={participante.saude.temAlergiaRemedio}
                />
                {participante.saude.descricaoAlergiaRemedio && (
                  <p className="text-xs text-cinza-medio pl-5 pb-1">
                    {participante.saude.descricaoAlergiaRemedio}
                  </p>
                )}
                <BoolRow
                  label="Tem intolerância alimentar"
                  value={participante.saude.temIntoleranciaAlimentar}
                />
                {participante.saude.descricaoIntoleranciaAlimentar && (
                  <p className="text-xs text-cinza-medio pl-5 pb-1">
                    {participante.saude.descricaoIntoleranciaAlimentar}
                  </p>
                )}
                <BoolRow
                  label="Toma medicação regular"
                  value={participante.saude.temMedicacaoRegular}
                />
                {participante.saude.descricaoMedicacaoRegular && (
                  <p className="text-xs text-cinza-medio pl-5 pb-1">
                    {participante.saude.descricaoMedicacaoRegular}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-cinza-medio py-2">Dados de saúde não cadastrados.</p>
            )}
          </CardContent>
        </Card>

        {/* Escola */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-verde-medio" />
              Escola
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {participante.escola ? (
              <>
                <InfoRow
                  icon={GraduationCap}
                  label="Nome da Escola"
                  value={participante.escola.nomeEscola}
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Série"
                  value={participante.escola.serie}
                />
                <InfoRow
                  icon={Calendar}
                  label="Período"
                  value={participante.escola.periodo}
                />
              </>
            ) : (
              <p className="text-sm text-cinza-medio py-2">Dados de escola não cadastrados.</p>
            )}
          </CardContent>
        </Card>

        {/* Moradia */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="h-4 w-4 text-verde-medio" />
              Moradia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {participante.moradia ? (
              <>
                <InfoRow
                  icon={Home}
                  label="Tipo de Imóvel"
                  value={
                    participante.moradia.tipoImovel
                      ? participante.moradia.tipoImovel === "OUTRO"
                        ? participante.moradia.tipoImovelOutro ?? "Outro"
                        : { PROPRIO: "Próprio", ALUGADO: "Alugado", CEDIDO: "Cedido" }[
                            participante.moradia.tipoImovel
                          ]
                      : null
                  }
                />
                {participante.moradia.valorAluguel != null && (
                  <InfoRow
                    icon={Home}
                    label="Valor do Aluguel"
                    value={`R$ ${participante.moradia.valorAluguel.toLocaleString("pt-BR")}`}
                  />
                )}
                <InfoRow
                  icon={Home}
                  label="NIS"
                  value={participante.moradia.nis}
                />
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-2 w-2 rounded-full ${participante.moradia.temAguaEncanada ? "bg-verde-medio" : "bg-cinza-medio/30"}`}
                    />
                    <span className="text-xs text-cinza-escuro">Água encanada</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-2 w-2 rounded-full ${participante.moradia.temEsgoto ? "bg-verde-medio" : "bg-cinza-medio/30"}`}
                    />
                    <span className="text-xs text-cinza-escuro">Esgoto</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-2 w-2 rounded-full ${participante.moradia.temEnergia ? "bg-verde-medio" : "bg-cinza-medio/30"}`}
                    />
                    <span className="text-xs text-cinza-escuro">Energia</span>
                  </div>
                </div>
                {participante.moradia.temBeneficios && participante.moradia.descricaoBeneficios && (
                  <InfoRow
                    icon={Home}
                    label="Benefícios Sociais"
                    value={participante.moradia.descricaoBeneficios}
                  />
                )}
              </>
            ) : (
              <p className="text-sm text-cinza-medio py-2">Dados de moradia não cadastrados.</p>
            )}
          </CardContent>
        </Card>

        {/* Filiação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users2 className="h-4 w-4 text-verde-medio" />
              Filiação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {participante.filiacao ? (
              <>
                <InfoRow icon={User} label="Nome da Mãe" value={participante.filiacao.nomeMae} />
                <InfoRow
                  icon={Phone}
                  label="Telefone da Mãe"
                  value={participante.filiacao.telefoneMae}
                />
                <InfoRow
                  icon={User}
                  label="Trabalho da Mãe"
                  value={participante.filiacao.trabalhoMae}
                />
                <InfoRow icon={User} label="Nome do Pai" value={participante.filiacao.nomePai} />
                <InfoRow
                  icon={Phone}
                  label="Telefone do Pai"
                  value={participante.filiacao.telefonePai}
                />
                <InfoRow
                  icon={User}
                  label="Trabalho do Pai"
                  value={participante.filiacao.trabalhoPai}
                />
              </>
            ) : (
              <p className="text-sm text-cinza-medio py-2">Dados de filiação não cadastrados.</p>
            )}
          </CardContent>
        </Card>

        {/* Autorização */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-verde-medio" />
              Autorização de Saída
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {participante.autorizacao ? (
              <>
                <div className="flex items-center gap-2 py-1">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${participante.autorizacao.podeSairSozinho ? "bg-verde-medio" : "bg-cinza-medio/30"}`}
                  />
                  <span className="text-sm text-texto-escuro">
                    {participante.autorizacao.podeSairSozinho
                      ? "Pode sair sozinho"
                      : "Não pode sair sozinho"}
                  </span>
                </div>
                <InfoRow
                  icon={User}
                  label="Pessoa Autorizada"
                  value={participante.autorizacao.nomeAutorizado}
                />
                <InfoRow
                  icon={User}
                  label="Vínculo"
                  value={participante.autorizacao.vinculoAutorizado}
                />
                <InfoRow
                  icon={Phone}
                  label="Telefone Autorizado"
                  value={participante.autorizacao.telefoneAutorizado}
                />
              </>
            ) : (
              <p className="text-sm text-cinza-medio py-2">
                Dados de autorização não cadastrados.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Família */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users2 className="h-4 w-4 text-verde-medio" />
              Composição Familiar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {participante.membrosF.length === 0 ? (
              <p className="text-sm text-cinza-medio py-2">Nenhum membro familiar cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {participante.membrosF.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-texto-escuro">{m.nome}</p>
                      <p className="text-xs text-cinza-medio">
                        {[m.parentesco, m.idade ? `${m.idade} anos` : null, m.profissao]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    {m.renda != null && (
                      <span className="text-xs text-cinza-medio">
                        R$ {m.renda.toLocaleString("pt-BR")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Observações */}
      {participante.observacao?.notas && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cinza-escuro whitespace-pre-wrap">
              {participante.observacao.notas}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Presenças Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-verde-medio" />
            Presenças Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {participante.presencas.length === 0 ? (
            <p className="text-sm text-cinza-medio text-center py-6">
              Nenhuma presença registrada para este participante.
            </p>
          ) : (
            <div className="space-y-2">
              {participante.presencas.map((pr) => (
                <div
                  key={pr.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${pr.presente ? "bg-verde-medio" : "bg-cinza-medio/40"}`}
                    />
                    <div>
                      <p className="text-sm font-medium text-texto-escuro">
                        {pr.atividade.nome}
                      </p>
                      <p className="text-xs text-cinza-medio">
                        {new Date(pr.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium ${pr.presente ? "text-green-700" : "text-cinza-medio"}`}
                  >
                    {pr.presente ? "Presente" : "Ausente"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <div className="text-xs text-cinza-medio flex gap-6">
        <span>Criado em: {participante.createdAt.toLocaleDateString("pt-BR")}</span>
        <span>Última atualização: {participante.updatedAt.toLocaleDateString("pt-BR")}</span>
      </div>
    </div>
  );
}
