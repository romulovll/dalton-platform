-- DropForeignKey
ALTER TABLE "agenda_psicologia" DROP CONSTRAINT "agenda_psicologia_participante_id_fkey";

-- AlterTable
ALTER TABLE "agenda_psicologia" ADD COLUMN     "nome_pessoa" TEXT,
ALTER COLUMN "participante_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "agenda_psicologia" ADD CONSTRAINT "agenda_psicologia_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "participantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
