import { Module } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';
import { TAREA_REPOSITORY } from '../../application/common/tarea-repository.token';
import { PrismaTareaRepository } from '../../infrastructure/repositories/prisma-tarea.repository';
import { CrearTareaUseCase } from '../../application/tareas/crear-tarea.use-case';
import { TareasController } from './tareas.controller';
import { ListarTareasUseCase } from '../../application/tareas/listar-tareas.use-case';
import { ObtenerTareaUseCase } from '../../application/tareas/obtener-tarea.use-case';
import { ActualizarTareaUseCase } from '../../application/tareas/actualizar-tarea.use-case';
import { EliminarTareaUseCase } from '../../application/tareas/eliminar-tarea.use-case';
import { PROGRESO_REPOSITORY } from '../../application/common/progreso-repository.token';
import { PrismaProgresoRepository } from '../../infrastructure/repositories/prisma-progreso.repository';

@Module({
  controllers: [TareasController],
  providers: [
    PrismaService,
    {
      provide: TAREA_REPOSITORY,
      useClass: PrismaTareaRepository,
    },
    {
      provide: PROGRESO_REPOSITORY,
      useClass: PrismaProgresoRepository,
    },
    CrearTareaUseCase,
    ListarTareasUseCase,
    ObtenerTareaUseCase,
    ActualizarTareaUseCase,
    EliminarTareaUseCase,
  ],
  exports: [TAREA_REPOSITORY],
})
export class TareasModule {}
