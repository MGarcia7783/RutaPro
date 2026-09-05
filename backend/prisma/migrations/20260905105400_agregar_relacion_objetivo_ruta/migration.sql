-- CreateTable
CREATE TABLE "ObjetivoRuta" (
    "objetivoId" TEXT NOT NULL,
    "rutaId" TEXT NOT NULL,

    CONSTRAINT "ObjetivoRuta_pkey" PRIMARY KEY ("objetivoId","rutaId")
);

-- AddForeignKey
ALTER TABLE "ObjetivoRuta" ADD CONSTRAINT "ObjetivoRuta_objetivoId_fkey" FOREIGN KEY ("objetivoId") REFERENCES "Objetivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjetivoRuta" ADD CONSTRAINT "ObjetivoRuta_rutaId_fkey" FOREIGN KEY ("rutaId") REFERENCES "Ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
