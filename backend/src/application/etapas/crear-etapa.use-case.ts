import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { ETAPA_REPOSITORY } from '../common/etapa-repository.token';
import type { EtapaRepository } from '../../domain/repositories/etapa.repository';
import { Etapa } from '../../domain/entities/etapa.entity';
import type { RutaRepository } from '../../domain/repositories/ruta.repository';
import { RUTA_REPOSITORY } from '../common/ruta-repository.token';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

export class CrearEtapaUseCase {
  constructor(
    @Inject(ETAPA_REPOSITORY)
    private readonly etapaRepository: EtapaRepository,

    @Inject(RUTA_REPOSITORY)
    private readonly rutaRepository: RutaRepository,
  ) {}

  async ejecutar(
    nombre: string,
    descripcion: string | null,
    rutaId: string,
    usuarioId: string,
    rol: string,
  ): Promise<Etapa> {
    try {
      const ruta = await this.rutaRepository.obtenerPorId(rutaId);

      if (!ruta) {
        throw new NotFoundException('La ruta especificada no existe');
      }

      if (rol !== 'Administrador' && ruta.usuarioId !== usuarioId) {
        throw new ForbiddenException(
          'No tienes permiso para crear una etapa en esta ruta',
        );
      }

      const ordenSiguiente =
        await this.etapaRepository.obtenerSiguienteOrden(rutaId);

      const etapa = new Etapa(
        crypto.randomUUID(),
        nombre,
        descripcion,
        ordenSiguiente,
        rutaId,
      );
      return await this.etapaRepository.crear(etapa);
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      PrismaErrorHelper.manejar(error);
    }
  }
}
