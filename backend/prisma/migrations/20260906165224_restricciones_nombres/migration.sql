/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId,titulo]` on the table `Objetivo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Ruta` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Objetivo_usuarioId_titulo_key" ON "Objetivo"("usuarioId", "titulo");

-- CreateIndex
CREATE UNIQUE INDEX "Ruta_nombre_key" ON "Ruta"("nombre");
