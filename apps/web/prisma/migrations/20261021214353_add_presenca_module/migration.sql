-- CreateEnum
CREATE TYPE "PublicoAlvo" AS ENUM ('CRIANCAS', 'IDOSOS', 'AMBOS');

-- CreateEnum
CREATE TYPE "SituacaoParticipante" AS ENUM ('ATIVO', 'INATIVO', 'TRANSFERIDO');

-- CreateEnum
CREATE TYPE "TipoImovel" AS ENUM ('PROPRIO', 'ALUGADO', 'CEDIDO', 'OUTRO');

-- AlterEnum
ALTER TYPE "PerfilAcesso" ADD VALUE 'PROFESSOR';

-- CreateTable
CREATE TABLE "participantes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "rg" TEXT,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "foto_url" TEXT,
    "unidade_id" TEXT NOT NULL,
    "situacao" "SituacaoParticipante" NOT NULL DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atividades" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "publico_alvo" "PublicoAlvo" NOT NULL,
    "unidade_id" TEXT,
    "usuario_id" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atividade_participantes" (
    "id" TEXT NOT NULL,
    "atividade_id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atividade_participantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presencas" (
    "id" TEXT NOT NULL,
    "atividade_id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT false,
    "observacao" TEXT,
    "registrado_por_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presencas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsaveis_participante" (
    "id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "nome" TEXT,
    "parentesco" TEXT,
    "telefone" TEXT,
    "trabalho" TEXT,
    "endereco" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "responsaveis_participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saude_participante" (
    "id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "tem_problemas_saude" BOOLEAN NOT NULL DEFAULT false,
    "descricao_problemas_saude" TEXT,
    "tem_deficiencia" BOOLEAN NOT NULL DEFAULT false,
    "descricao_deficiencia" TEXT,
    "tem_alergia_remedio" BOOLEAN NOT NULL DEFAULT false,
    "descricao_alergia_remedio" TEXT,
    "tem_intolerancia_alimentar" BOOLEAN NOT NULL DEFAULT false,
    "descricao_intolerancia_alimentar" TEXT,
    "tem_medicacao_regular" BOOLEAN NOT NULL DEFAULT false,
    "descricao_medicacao_regular" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saude_participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escolas_participante" (
    "id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "nome_escola" TEXT,
    "periodo" TEXT,
    "serie" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escolas_participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moradia_participante" (
    "id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "tipo_imovel" "TipoImovel",
    "tipo_imovel_outro" TEXT,
    "valor_aluguel" INTEGER,
    "tem_agua_encanada" BOOLEAN NOT NULL DEFAULT false,
    "tem_esgoto" BOOLEAN NOT NULL DEFAULT false,
    "tem_energia" BOOLEAN NOT NULL DEFAULT false,
    "nis" TEXT,
    "tem_beneficios" BOOLEAN NOT NULL DEFAULT false,
    "descricao_beneficios" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "moradia_participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filiacao_participante" (
    "id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "nome_mae" TEXT,
    "telefone_mae" TEXT,
    "trabalho_mae" TEXT,
    "nome_pai" TEXT,
    "telefone_pai" TEXT,
    "trabalho_pai" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filiacao_participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autorizacao_participante" (
    "id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "pode_sair_sozinho" BOOLEAN NOT NULL DEFAULT false,
    "nome_autorizado" TEXT,
    "vinculo_autorizado" TEXT,
    "telefone_autorizado" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "autorizacao_participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membros_familiares" (
    "id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "parentesco" TEXT,
    "idade" INTEGER,
    "profissao" TEXT,
    "renda" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membros_familiares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observacao_participante" (
    "id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "observacao_participante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participantes_cpf_key" ON "participantes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "atividade_participantes_atividade_id_participante_id_key" ON "atividade_participantes"("atividade_id", "participante_id");

-- CreateIndex
CREATE UNIQUE INDEX "presencas_atividade_id_participante_id_data_key" ON "presencas"("atividade_id", "participante_id", "data");

-- CreateIndex
CREATE UNIQUE INDEX "saude_participante_participante_id_key" ON "saude_participante"("participante_id");

-- CreateIndex
CREATE UNIQUE INDEX "escolas_participante_participante_id_key" ON "escolas_participante"("participante_id");

-- CreateIndex
CREATE UNIQUE INDEX "moradia_participante_participante_id_key" ON "moradia_participante"("participante_id");

-- CreateIndex
CREATE UNIQUE INDEX "filiacao_participante_participante_id_key" ON "filiacao_participante"("participante_id");

-- CreateIndex
CREATE UNIQUE INDEX "autorizacao_participante_participante_id_key" ON "autorizacao_participante"("participante_id");

-- CreateIndex
CREATE UNIQUE INDEX "observacao_participante_participante_id_key" ON "observacao_participante"("participante_id");

-- AddForeignKey
ALTER TABLE "participantes" ADD CONSTRAINT "participantes_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividade_participantes" ADD CONSTRAINT "atividade_participantes_atividade_id_fkey" FOREIGN KEY ("atividade_id") REFERENCES "atividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividade_participantes" ADD CONSTRAINT "atividade_participantes_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presencas" ADD CONSTRAINT "presencas_atividade_id_fkey" FOREIGN KEY ("atividade_id") REFERENCES "atividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presencas" ADD CONSTRAINT "presencas_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presencas" ADD CONSTRAINT "presencas_registrado_por_id_fkey" FOREIGN KEY ("registrado_por_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsaveis_participante" ADD CONSTRAINT "responsaveis_participante_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saude_participante" ADD CONSTRAINT "saude_participante_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escolas_participante" ADD CONSTRAINT "escolas_participante_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moradia_participante" ADD CONSTRAINT "moradia_participante_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filiacao_participante" ADD CONSTRAINT "filiacao_participante_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autorizacao_participante" ADD CONSTRAINT "autorizacao_participante_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membros_familiares" ADD CONSTRAINT "membros_familiares_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observacao_participante" ADD CONSTRAINT "observacao_participante_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
