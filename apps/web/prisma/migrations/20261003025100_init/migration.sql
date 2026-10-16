-- CreateEnum
CREATE TYPE "SituacaoUnidade" AS ENUM ('ATIVA', 'INATIVA', 'EM_IMPLANTACAO');

-- CreateEnum
CREATE TYPE "FormaAquisicao" AS ENUM ('COMPRA', 'DOACAO', 'CESSAO', 'COMODATO', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "OrigemRecurso" AS ENUM ('PROPRIO', 'PARCERIA_PUBLICA', 'DOACAO');

-- CreateEnum
CREATE TYPE "EstadoConservacao" AS ENUM ('EXCELENTE', 'BOM', 'REGULAR', 'RUIM', 'INSERVIVEL');

-- CreateEnum
CREATE TYPE "SituacaoBem" AS ENUM ('ATIVO', 'EM_MANUTENCAO', 'CEDIDO', 'BAIXADO', 'DESAPARECIDO');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('TRANSFERENCIA_INTERNA', 'TRANSFERENCIA_UNIDADE', 'CESSAO', 'MANUTENCAO_ENVIO', 'MANUTENCAO_RETORNO', 'BAIXA');

-- CreateEnum
CREATE TYPE "SituacaoUsuario" AS ENUM ('ATIVO', 'INATIVO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "PerfilAcesso" AS ENUM ('ADMIN_GERAL', 'ADMIN_UNIDADE', 'GESTOR', 'RESPONSAVEL_SETOR', 'CONTADOR', 'AUDITOR', 'CONSULTA');

-- CreateTable
CREATE TABLE "organizacoes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "responsavel_legal" TEXT,
    "endereco_sede" TEXT,
    "logotipo_url" TEXT,
    "prefixo_tombamento" TEXT NOT NULL DEFAULT 'IDS',
    "proximo_tombamento" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL DEFAULT 'SP',
    "cep" TEXT,
    "situacao" "SituacaoUnidade" NOT NULL DEFAULT 'ATIVA',
    "data_inicio" TIMESTAMP(3),
    "observacoes" TEXT,
    "organizacao_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "unidade_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "setores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "vida_util_anos" INTEGER NOT NULL,
    "taxa_anual" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_item" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipos_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bens" (
    "id" TEXT NOT NULL,
    "tombamento" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "tipo_item_id" TEXT,
    "marca" TEXT,
    "modelo" TEXT,
    "numero_serie" TEXT,
    "unidade_atual_id" TEXT NOT NULL,
    "setor_id" TEXT,
    "localizacao" TEXT,
    "responsavel" TEXT NOT NULL,
    "data_aquisicao" TIMESTAMP(3) NOT NULL,
    "valor_aquisicao" DECIMAL(12,2) NOT NULL,
    "forma_aquisicao" "FormaAquisicao" NOT NULL,
    "nota_fiscal" TEXT,
    "fornecedor" TEXT,
    "origem_recurso" "OrigemRecurso" NOT NULL,
    "numero_parceria" TEXT,
    "estado_conservacao" "EstadoConservacao" NOT NULL,
    "situacao" "SituacaoBem" NOT NULL DEFAULT 'ATIVO',
    "vida_util_meses" INTEGER,
    "valor_residual" DECIMAL(12,2),
    "depreciacao_acumulada" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "inalienabilidade" BOOLEAN NOT NULL DEFAULT false,
    "bem_remanescente" BOOLEAN NOT NULL DEFAULT false,
    "parceria_id" TEXT,
    "foto_url" TEXT,
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentacoes" (
    "id" TEXT NOT NULL,
    "bem_id" TEXT NOT NULL,
    "tipo" "TipoMovimentacao" NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT,
    "observacoes" TEXT,
    "unidade_origem_id" TEXT,
    "unidade_destino_id" TEXT,
    "setor_origem_id" TEXT,
    "setor_destino_id" TEXT,
    "documento_autorizador" TEXT,
    "custo_manutencao" DECIMAL(12,2),
    "data_retorno_previsto" TIMESTAMP(3),
    "data_retorno_real" TIMESTAMP(3),
    "usuario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcerias" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "orgao_parceiro" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "valor_repasse" DECIMAL(12,2),
    "situacao" TEXT NOT NULL DEFAULT 'vigente',
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parcerias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "cpf" TEXT,
    "telefone" TEXT,
    "situacao" "SituacaoUsuario" NOT NULL DEFAULT 'ATIVO',
    "primeiro_acesso" BOOLEAN NOT NULL DEFAULT true,
    "tentativas_login" INTEGER NOT NULL DEFAULT 0,
    "bloqueado_ate" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_unidades" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "unidade_id" TEXT NOT NULL,
    "perfil" "PerfilAcesso" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidade_id" TEXT NOT NULL,
    "bem_id" TEXT,
    "dados" JSONB,
    "usuario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizacoes_cnpj_key" ON "organizacoes"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_codigo_key" ON "unidades"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "setores_unidade_id_nome_key" ON "setores"("unidade_id", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nome_key" ON "categorias"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_item_categoria_id_nome_key" ON "tipos_item"("categoria_id", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "bens_tombamento_key" ON "bens"("tombamento");

-- CreateIndex
CREATE UNIQUE INDEX "parcerias_numero_key" ON "parcerias"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_unidades_usuario_id_unidade_id_key" ON "usuario_unidades"("usuario_id", "unidade_id");

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_organizacao_id_fkey" FOREIGN KEY ("organizacao_id") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setores" ADD CONSTRAINT "setores_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipos_item" ADD CONSTRAINT "tipos_item_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bens" ADD CONSTRAINT "bens_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bens" ADD CONSTRAINT "bens_tipo_item_id_fkey" FOREIGN KEY ("tipo_item_id") REFERENCES "tipos_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bens" ADD CONSTRAINT "bens_unidade_atual_id_fkey" FOREIGN KEY ("unidade_atual_id") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bens" ADD CONSTRAINT "bens_setor_id_fkey" FOREIGN KEY ("setor_id") REFERENCES "setores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bens" ADD CONSTRAINT "bens_parceria_id_fkey" FOREIGN KEY ("parceria_id") REFERENCES "parcerias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_bem_id_fkey" FOREIGN KEY ("bem_id") REFERENCES "bens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_unidades" ADD CONSTRAINT "usuario_unidades_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_unidades" ADD CONSTRAINT "usuario_unidades_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_bem_id_fkey" FOREIGN KEY ("bem_id") REFERENCES "bens"("id") ON DELETE SET NULL ON UPDATE CASCADE;
