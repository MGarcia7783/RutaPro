import {
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TAREA_REPOSITORY } from '../common/tarea-repository.token';
import type { TareaRepository } from '../../domain/repositories/tarea.repository';
import { Tarea } from '../../domain/entities/tarea.entity';

export class ObtenerTareaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async ejecutar(
    id: string,
    usuarioId: string,
    rol: string,
  ): Promise<Tarea & { usuario: string }> {
    try {
      const resultado = await this.tareaRepository.obtenerPorIdConRuta(id);

      if (!resultado) {
        throw new NotFoundException('Tarea no encontrada');
      }

      if (rol !== 'Administrador' && resultado.usuarioId !== usuarioId) {
        throw new ForbiddenException(
          'No tienes permiso para acceder a esta tarea',
        );
      }

      // Retornar la tarea junto con el nombre del usuario propietario de la ruta
      return {
        ...resultado.tarea,
        usuario: resultado.usuario,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la tarea');
    }
  }
}
