-- CreateEnum
CREATE TYPE "CategoriaDocumento" AS ENUM ('BALANCO', 'PRESTACAO_CONTAS', 'ATA', 'ESTATUTO', 'RELATORIO_ATIVIDADES', 'PARECER_FISCAL', 'CERTIDAO', 'CONTRATO_PARCERIA', 'OUTRO');

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" "CategoriaDocumento" NOT NULL,
    "ano" INTEGER NOT NULL,
    "arquivo_url" TEXT NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "usuario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
