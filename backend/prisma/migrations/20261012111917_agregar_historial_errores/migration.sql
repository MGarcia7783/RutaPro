-- CreateTable
CREATE TABLE "ErrorLog" (
    "id" TEXT NOT NULL,
    "peticionId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "nombreUsuario" TEXT,
    "metodo" TEXT NOT NULL,
    "ruta" TEXT NOT NULL,
    "codigoEstadoHttp" INTEGER NOT NULL,
    "tipoError" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "detalleTecnico" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ErrorLog_peticionId_idx" ON "ErrorLog"("peticionId");

-- CreateIndex
CREATE INDEX "ErrorLog_usuarioId_idx" ON "ErrorLog"("usuarioId");

-- CreateIndex
CREATE INDEX "ErrorLog_creadoEn_idx" ON "ErrorLog"("creadoEn");

-- CreateIndex
CREATE INDEX "ErrorLog_codigoEstadoHttp_creadoEn_idx" ON "ErrorLog"("codigoEstadoHttp", "creadoEn");

-- AddForeignKey
ALTER TABLE "ErrorLog" ADD CONSTRAINT "ErrorLog_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
