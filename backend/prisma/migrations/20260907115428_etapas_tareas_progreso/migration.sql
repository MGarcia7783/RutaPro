/*
  Warnings:

  - You are about to drop the column `actualizadoEn` on the `Objetivo` table. All the data in the column will be lost.
  - You are about to drop the column `completado` on the `Objetivo` table. All the data in the column will be lost.
  - You are about to drop the column `creadoEn` on the `Objetivo` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Objetivo` table. All the data in the column will be lost.
  - You are about to drop the column `actualizacion` on the `Progreso` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Progreso` table. All the data in the column will be lost.
  - You are about to drop the `ObjetivoRuta` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[etapaId,titulo]` on the table `Objetivo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rutaId]` on the table `Progreso` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `etapaId` to the `Objetivo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Progreso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Ruta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Objetivo" DROP CONSTRAINT "Objetivo_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "ObjetivoRuta" DROP CONSTRAINT "ObjetivoRuta_objetivoId_fkey";

-- DropForeignKey
ALTER TABLE "ObjetivoRuta" DROP CONSTRAINT "ObjetivoRuta_rutaId_fkey";

-- DropForeignKey
ALTER TABLE "Progreso" DROP CONSTRAINT "Progreso_rutaId_fkey";

-- DropForeignKey
ALTER TABLE "Progreso" DROP CONSTRAINT "Progreso_usuarioId_fkey";

-- DropIndex
DROP INDEX "Objetivo_usuarioId_idx";

-- DropIndex
DROP INDEX "Objetivo_usuarioId_titulo_key";

-- DropIndex
DROP INDEX "Progreso_usuarioId_rutaId_key";

-- AlterTable
ALTER TABLE "Objetivo" DROP COLUMN "actualizadoEn",
DROP COLUMN "completado",
DROP COLUMN "creadoEn",
DROP COLUMN "usuarioId",
ADD COLUMN     "etapaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Progreso" DROP COLUMN "actualizacion",
DROP COLUMN "usuarioId",
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Ruta" ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ObjetivoRuta";

-- CreateTable
CREATE TABLE "Etapa" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL,
    "rutaId" TEXT NOT NULL,

    CONSTRAINT "Etapa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tarea" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "objetivoId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tarea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Etapa_rutaId_idx" ON "Etapa"("rutaId");

-- CreateIndex
CREATE UNIQUE INDEX "Etapa_rutaId_orden_key" ON "Etapa"("rutaId", "orden");

-- CreateIndex
CREATE INDEX "Tarea_objetivoId_idx" ON "Tarea"("objetivoId");

-- CreateIndex
CREATE UNIQUE INDEX "Tarea_objetivoId_titulo_key" ON "Tarea"("objetivoId", "titulo");

-- CreateIndex
CREATE INDEX "Objetivo_etapaId_idx" ON "Objetivo"("etapaId");

-- CreateIndex
CREATE UNIQUE INDEX "Objetivo_etapaId_titulo_key" ON "Objetivo"("etapaId", "titulo");

-- CreateIndex
CREATE UNIQUE INDEX "Progreso_rutaId_key" ON "Progreso"("rutaId");

-- CreateIndex
CREATE INDEX "Ruta_usuarioId_idx" ON "Ruta"("usuarioId");

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etapa" ADD CONSTRAINT "Etapa_rutaId_fkey" FOREIGN KEY ("rutaId") REFERENCES "Ruta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objetivo" ADD CONSTRAINT "Objetivo_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "Etapa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarea" ADD CONSTRAINT "Tarea_objetivoId_fkey" FOREIGN KEY ("objetivoId") REFERENCES "Objetivo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progreso" ADD CONSTRAINT "Progreso_rutaId_fkey" FOREIGN KEY ("rutaId") REFERENCES "Ruta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
