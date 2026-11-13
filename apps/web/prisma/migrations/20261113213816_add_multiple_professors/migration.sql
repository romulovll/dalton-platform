-- CreateTable
CREATE TABLE "atividade_professores" (
    "id" TEXT NOT NULL,
    "atividade_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atividade_professores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "atividade_professores_atividade_id_usuario_id_key" ON "atividade_professores"("atividade_id", "usuario_id");

-- AddForeignKey
ALTER TABLE "atividade_professores" ADD CONSTRAINT "atividade_professores_atividade_id_fkey" FOREIGN KEY ("atividade_id") REFERENCES "atividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividade_professores" ADD CONSTRAINT "atividade_professores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
