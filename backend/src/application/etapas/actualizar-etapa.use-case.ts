import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { ETAPA_REPOSITORY } from '../common/etapa-repository.token';
import type { EtapaRepository } from '../../domain/repositories/etapa.repository';
import { Etapa } from '../../domain/entities/etapa.entity';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

export class ActualizarEtapaUseCase {
  constructor(
    @Inject(ETAPA_REPOSITORY)
    private readonly etapaRepository: EtapaRepository,
  ) {}

  async ejecutar(
    id: string,
    nombre: string | undefined,
    descripcion: string | undefined,
    usuarioId: string,
    rol: string,
  ): Promise<Etapa> {
    try {
      const resultado = await this.etapaRepository.obtenerPorIdConRuta(id);

      if (!resultado) {
        throw new NotFoundException('Etapa no encontrada');
      }

      if (rol !== 'Administrador' && resultado.usuarioId !== usuarioId) {
        throw new ForbiddenException(
          'No tienes permiso para actualizar esta etapa',
        );
      }

      const etapa = resultado.etapa;

      if (nombre !== undefined) {
        etapa.nombre = nombre;
      }

      if (descripcion !== undefined) {
        etapa.descripcion = descripcion;
      }

      return await this.etapaRepository.actualizar(etapa);
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
