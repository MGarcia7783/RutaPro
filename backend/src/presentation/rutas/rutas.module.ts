import { Module } from '@nestjs/common';
import { RutasController } from './rutas.controller';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';
import { RUTA_REPOSITORY } from '../../application/common/ruta-repository.token';
import { PrismaRutaRepository } from '../../infrastructure/repositories/prisma-ruta.repository';
import { CrearRutaUseCase } from '../../application/rutas/crear-ruta.use-case';
import { ListarRutasUseCase } from '../../application/rutas/listar-rutas.use-case';
import { ObtenerRutaUseCase } from '../../application/rutas/obtener-ruta.use-case';
import { ActualizarRutaUseCase } from '../../application/rutas/actualizar-ruta.use-case';
import { EliminarRutaUseCase } from '../../application/rutas/eliminar-ruta.use-case';

@Module({
  controllers: [RutasController],

  providers: [
    PrismaService,
    {
      provide: RUTA_REPOSITORY,
      useClass: PrismaRutaRepository,
    },

    CrearRutaUseCase,
    ListarRutasUseCase,
    ObtenerRutaUseCase,
    ActualizarRutaUseCase,
    EliminarRutaUseCase,
  ],
  exports: [RUTA_REPOSITORY],
})
export class RutasModule {}
