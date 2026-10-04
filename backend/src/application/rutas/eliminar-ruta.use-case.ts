import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { RUTA_REPOSITORY } from '../common/ruta-repository.token';
import type { RutaRepository } from '../../domain/repositories/ruta.repository';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

export class EliminarRutaUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY)
    private readonly rutaRepository: RutaRepository,
  ) {}

  async ejecutar(
    id: string,
    usuarioId: string,
    rol: string,
  ): Promise<{ mensaje: string }> {
    try {
      const ruta = await this.rutaRepository.obtenerPorId(id);

      if (!ruta) {
        throw new NotFoundException('Ruta no encontrada');
      }

      if (ruta.usuarioId !== usuarioId && rol !== 'Administrador') {
        throw new ForbiddenException(
          'No tiene permisos para eliminar esta ruta',
        );
      }

      await this.rutaRepository.eliminar(id);
      return { mensaje: 'Ruta eliminada correctamente' };
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
