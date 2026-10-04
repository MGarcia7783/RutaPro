/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId,nombre]` on the table `Ruta` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ruta_nombre_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ruta_usuarioId_nombre_key" ON "Ruta"("usuarioId", "nombre");
