/*
  Warnings:

  - You are about to drop the column `objetivoId` on the `Tarea` table. All the data in the column will be lost.
  - You are about to drop the `Objetivo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[etapaId,titulo]` on the table `Tarea` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `etapaId` to the `Tarea` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Objetivo" DROP CONSTRAINT "Objetivo_etapaId_fkey";

-- DropForeignKey
ALTER TABLE "Tarea" DROP CONSTRAINT "Tarea_objetivoId_fkey";

-- DropIndex
DROP INDEX "Tarea_objetivoId_idx";

-- DropIndex
DROP INDEX "Tarea_objetivoId_titulo_key";

-- AlterTable
ALTER TABLE "Tarea" DROP COLUMN "objetivoId",
ADD COLUMN     "etapaId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Objetivo";

-- CreateIndex
CREATE INDEX "Tarea_etapaId_idx" ON "Tarea"("etapaId");

-- CreateIndex
CREATE UNIQUE INDEX "Tarea_etapaId_titulo_key" ON "Tarea"("etapaId", "titulo");

-- AddForeignKey
ALTER TABLE "Tarea" ADD CONSTRAINT "Tarea_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "Etapa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
