-- CreateEnum
CREATE TYPE "SituacaoInventario" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusVerificacao" AS ENUM ('PENDENTE', 'LOCALIZADO', 'NAO_LOCALIZADO', 'DIVERGENTE');

-- CreateTable
CREATE TABLE "inventarios" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP(3),
    "situacao" "SituacaoInventario" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "responsavel_id" TEXT NOT NULL,
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventario_itens" (
    "id" TEXT NOT NULL,
    "inventario_id" TEXT NOT NULL,
    "bem_id" TEXT NOT NULL,
    "status" "StatusVerificacao" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "verificado_em" TIMESTAMP(3),
    "verificado_por" TEXT,

    CONSTRAINT "inventario_itens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventarios_codigo_key" ON "inventarios"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "inventario_itens_inventario_id_bem_id_key" ON "inventario_itens"("inventario_id", "bem_id");

-- AddForeignKey
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario_itens" ADD CONSTRAINT "inventario_itens_inventario_id_fkey" FOREIGN KEY ("inventario_id") REFERENCES "inventarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario_itens" ADD CONSTRAINT "inventario_itens_bem_id_fkey" FOREIGN KEY ("bem_id") REFERENCES "bens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
