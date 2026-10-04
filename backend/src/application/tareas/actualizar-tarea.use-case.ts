import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import type { TareaRepository } from '../../domain/repositories/tarea.repository';
import { TAREA_REPOSITORY } from '../common/tarea-repository.token';
import { Tarea } from '../../domain/entities/tarea.entity';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

export class ActualizarTareaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async ejecutar(
    id: string,
    usuarioId: string,
    rol: string,
    titulo?: string,
    descripcion?: string,
    completada?: boolean,
  ): Promise<Tarea> {
    try {
      const resultado = await this.tareaRepository.obtenerPorIdConRuta(id);

      if (!resultado) {
        throw new NotFoundException('Tarea no encontrada');
      }

      if (rol !== 'Administrador' && resultado.usuarioId !== usuarioId) {
        throw new ForbiddenException(
          'No tienes permiso para actualizar esta tarea',
        );
      }

      const tarea = resultado.tarea;

      if (titulo !== undefined) {
        tarea.titulo = titulo;
      }

      if (descripcion !== undefined) {
        tarea.descripcion = descripcion;
      }

      if (completada !== undefined) {
        tarea.completada = completada;
      }

      return await this.tareaRepository.actualizar(tarea);
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
