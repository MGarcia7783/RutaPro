import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { ProgresoRepository } from '../../domain/repositories/progreso.repository';
import { Progreso } from '../../generated/prisma/client';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';
import { PROGRESO_REPOSITORY } from '../common/progreso-repository.token';
import type { RutaRepository } from '../../domain/repositories/ruta.repository';
import { RUTA_REPOSITORY } from '../common/ruta-repository.token';

@Injectable()
export class ObtenerProgresoUseCase {
  constructor(
    @Inject(PROGRESO_REPOSITORY)
    private readonly progresoRepository: ProgresoRepository,

    @Inject(RUTA_REPOSITORY)
    private readonly rutaRepository: RutaRepository,
  ) {}

  async ejecutar(
    rutaId: string,
    usuarioId: string,
    rol: string,
  ): Promise<Progreso> {
    try {
      const ruta = await this.rutaRepository.obtenerPorId(rutaId);

      if (!ruta) {
        throw new NotFoundException('No se encontró la ruta especificada');
      }

      if (rol !== 'Administrador' && ruta.usuarioId !== usuarioId) {
        throw new ForbiddenException(
          'No tienes permiso para consultar el progreso de esta ruta',
        );
      }

      const progreso = await this.progresoRepository.obtenerPorRutaId(rutaId);

      if (!progreso) {
        throw new NotFoundException('El progreso de la ruta no existe.');
      }

      return progreso;
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
