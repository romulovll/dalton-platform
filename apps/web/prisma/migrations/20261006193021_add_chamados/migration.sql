-- CreateEnum
CREATE TYPE "TipoChamado" AS ENUM ('ERRO', 'AJUSTE', 'DUVIDA', 'SUGESTAO');

-- CreateEnum
CREATE TYPE "PrioridadeChamado" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "SituacaoChamado" AS ENUM ('ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO');

-- CreateTable
CREATE TABLE "chamados" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "TipoChamado" NOT NULL,
    "prioridade" "PrioridadeChamado" NOT NULL DEFAULT 'MEDIA',
    "situacao" "SituacaoChamado" NOT NULL DEFAULT 'ABERTO',
    "resposta" TEXT,
    "usuario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chamados_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chamados" ADD CONSTRAINT "chamados_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
