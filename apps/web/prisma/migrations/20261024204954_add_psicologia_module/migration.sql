-- CreateEnum
CREATE TYPE "TipoAtendimentoPsi" AS ENUM ('INDIVIDUAL', 'GRUPO', 'FAMILIA', 'ACOLHIMENTO');

-- CreateEnum
CREATE TYPE "StatusAgendaPsi" AS ENUM ('AGENDADO', 'REALIZADO', 'FALTA', 'CANCELADO', 'REAGENDADO');

-- AlterEnum
ALTER TYPE "PerfilAcesso" ADD VALUE 'PSICOLOGO';

-- CreateTable
CREATE TABLE "agenda_psicologia" (
    "id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "psicologo_id" TEXT NOT NULL,
    "unidade_id" TEXT,
    "data_hora" TIMESTAMP(3) NOT NULL,
    "duracao" INTEGER NOT NULL DEFAULT 50,
    "tipo" "TipoAtendimentoPsi" NOT NULL,
    "status" "StatusAgendaPsi" NOT NULL DEFAULT 'AGENDADO',
    "cancelado_por" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agenda_psicologia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "agenda_psicologia" ADD CONSTRAINT "agenda_psicologia_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda_psicologia" ADD CONSTRAINT "agenda_psicologia_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda_psicologia" ADD CONSTRAINT "agenda_psicologia_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
