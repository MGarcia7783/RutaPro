/*
  Warnings:

  - A unique constraint covering the columns `[rutaId,nombre]` on the table `Etapa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Etapa_rutaId_nombre_key" ON "Etapa"("rutaId", "nombre");
