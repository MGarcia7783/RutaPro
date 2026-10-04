import { ForbiddenException, Inject } from '@nestjs/common';
import { Tarea } from '../../domain/entities/tarea.entity';
import type { TareaRepository } from '../../domain/repositories/tarea.repository';
import { TAREA_REPOSITORY } from '../common/tarea-repository.token';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

export class CrearTareaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async ejecutar(
    titulo: string,
    descripcion: string | null,
    etapaId: string,
    usuarioId: string,
    rol: string,
  ): Promise<Tarea> {
    try {
      if (rol !== 'Administrador') {
        const tieneAcceso = await this.tareaRepository.tieneAccesoEtapa(
          etapaId,
          usuarioId,
        );

        if (!tieneAcceso) {
          throw new ForbiddenException(
            'No tienes permiso para crear una tarea en esta etapa',
          );
        }
      }

      const tarea = new Tarea(
        crypto.randomUUID(),
        titulo,
        descripcion,
        etapaId,
        new Date(),
        new Date(),
      );
      return await this.tareaRepository.crear(tarea);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      PrismaErrorHelper.manejar(error);
    }
  }
}
