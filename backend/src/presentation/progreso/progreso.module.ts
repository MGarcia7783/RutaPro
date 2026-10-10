import { Module } from '@nestjs/common';
import { ProgresoController } from './progreso.controller';
import { PROGRESO_REPOSITORY } from '../../application/common/progreso-repository.token';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';
import { ObtenerProgresoUseCase } from '../../application/progreso/obtener-progreso.use-case';
import { PrismaProgresoRepository } from '../../infrastructure/repositories/prisma-progreso.repository';
import { TareasModule } from '../tareas/tareas.module';
import { RutasModule } from '../rutas/rutas.module';

@Module({
  imports: [TareasModule, RutasModule],
  controllers: [ProgresoController],

  providers: [
    PrismaService,
    {
      provide: PROGRESO_REPOSITORY,
      useClass: PrismaProgresoRepository,
    },

    ObtenerProgresoUseCase,
  ],
  exports: [PROGRESO_REPOSITORY],
})
export class ProgresoModule {}
