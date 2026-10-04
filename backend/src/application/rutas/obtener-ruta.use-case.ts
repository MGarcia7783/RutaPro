import {
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RUTA_REPOSITORY } from '../common/ruta-repository.token';
import type { RutaRepository } from '../../domain/repositories/ruta.repository';
import { Ruta } from '../../domain/entities/ruta.entity';

export class ObtenerRutaUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY)
    private readonly rutaRepository: RutaRepository,
  ) {}
  async ejecutar(
    id: string,
    usuarioId: string,
    rol: string,
  ): Promise<Ruta & { usuario: string }> {
    try {
      const ruta = await this.rutaRepository.obtenerPorId(id);

      if (!ruta) {
        throw new NotFoundException('Ruta no encontrada');
      }

      if (ruta.usuarioId !== usuarioId && rol !== 'Administrador') {
        throw new ForbiddenException(
          'No tiene permisos para obtener esta ruta',
        );
      }

      return ruta;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la ruta');
    }
  }
}
