import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Ruta } from '../../domain/entities/ruta.entity';
import type { RutaRepository } from '../../domain/repositories/ruta.repository';
import { RUTA_REPOSITORY } from '../common/ruta-repository.token';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

@Injectable()
export class ActualizarRutaUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY)
    private readonly rutaRepository: RutaRepository,
  ) {}

  async ejecutar(
    id: string,
    nombre: string | undefined,
    descripcion: string | undefined,
    usuarioId: string,
    rol: string,
  ): Promise<Ruta> {
    try {
      const ruta = await this.rutaRepository.obtenerPorId(id);

      // Validar que la ruta existe
      if (!ruta) {
        throw new NotFoundException('Ruta no encontrada');
      }

      // Validar que el usuario tiene permisos para actualizar la ruta
      if (ruta.usuarioId !== usuarioId && rol !== 'Administrador') {
        throw new ForbiddenException(
          'No tiene permisos para actualizar esta ruta',
        );
      }

      // Actualizar el nombre de la ruta si se proporciona
      if (nombre !== undefined) {
        ruta.nombre = nombre;
      }

      // Actualizar la descripción de la ruta si se proporciona
      if (descripcion !== undefined) {
        ruta.descripcion = descripcion;
      }

      return await this.rutaRepository.actualizar(ruta);
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
