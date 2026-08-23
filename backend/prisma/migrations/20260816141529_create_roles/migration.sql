/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actualizadoEn` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rolId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "rolId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Rol" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_googleId_key" ON "Usuario"("googleId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
