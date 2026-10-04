import { Inject } from '@nestjs/common';
import { RUTA_REPOSITORY } from '../common/ruta-repository.token';
import type { RutaRepository } from '../../domain/repositories/ruta.repository';
import { Ruta } from '../../domain/entities/ruta.entity';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

export class CrearRutaUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY)
    private readonly rutaRepository: RutaRepository,
  ) {}

  async ejecutar(
    nombre: string,
    descripcion: string,
    usuarioId: string,
  ): Promise<Ruta> {
    try {
      const ruta = new Ruta(
        crypto.randomUUID(),
        nombre,
        descripcion,
        usuarioId,
        new Date(),
      );

      // Guardar la nueva ruta
      return await this.rutaRepository.guardar(ruta);
    } catch (error) {
      PrismaErrorHelper.manejar(error);
    }
  }
}
