/*
  Warnings:

  - You are about to drop the column `googleId` on the `Usuario` table. All the data in the column will be lost.
  - Made the column `passwordHash` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Usuario_googleId_key";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "googleId",
ADD COLUMN     "estado" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "passwordHash" SET NOT NULL;
