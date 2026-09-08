-- DropForeignKey
ALTER TABLE "Etapa" DROP CONSTRAINT "Etapa_rutaId_fkey";

-- DropForeignKey
ALTER TABLE "Objetivo" DROP CONSTRAINT "Objetivo_etapaId_fkey";

-- DropForeignKey
ALTER TABLE "Progreso" DROP CONSTRAINT "Progreso_rutaId_fkey";

-- DropForeignKey
ALTER TABLE "Ruta" DROP CONSTRAINT "Ruta_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Tarea" DROP CONSTRAINT "Tarea_objetivoId_fkey";

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etapa" ADD CONSTRAINT "Etapa_rutaId_fkey" FOREIGN KEY ("rutaId") REFERENCES "Ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objetivo" ADD CONSTRAINT "Objetivo_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "Etapa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarea" ADD CONSTRAINT "Tarea_objetivoId_fkey" FOREIGN KEY ("objetivoId") REFERENCES "Objetivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progreso" ADD CONSTRAINT "Progreso_rutaId_fkey" FOREIGN KEY ("rutaId") REFERENCES "Ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
