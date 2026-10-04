import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import type { TareaRepository } from '../../domain/repositories/tarea.repository';
import { TAREA_REPOSITORY } from '../common/tarea-repository.token';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

export class EliminarTareaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async ejecutar(id: string, usuarioId: string, rol: string): Promise<void> {
    try {
      const resultado = await this.tareaRepository.obtenerPorIdConRuta(id);

      if (!resultado) {
        throw new NotFoundException('Tarea no encontrada');
      }

      if (rol !== 'Administrador' && resultado.usuarioId !== usuarioId) {
        throw new ForbiddenException(
          'No tienes permiso para eliminar esta tarea',
        );
      }

      await this.tareaRepository.eliminar(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      PrismaErrorHelper.manejar(error);
    }
  }
}
