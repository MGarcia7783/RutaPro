import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { ETAPA_REPOSITORY } from '../common/etapa-repository.token';
import type { EtapaRepository } from '../../domain/repositories/etapa.repository';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

export class EliminarEtapaUseCase {
  constructor(
    @Inject(ETAPA_REPOSITORY)
    private readonly etapaRepository: EtapaRepository,
  ) {}

  async ejecutar(
    id: string,
    usuarioId: string,
    rol: string,
  ): Promise<{ mensaje: string }> {
    try {
      const resultado = await this.etapaRepository.obtenerPorIdConRuta(id);

      if (!resultado) {
        throw new NotFoundException('Etapa no encontrada');
      }

      if (rol !== 'Administrador' && resultado.usuarioId !== usuarioId) {
        throw new ForbiddenException(
          'No tienes permiso para eliminar esta etapa',
        );
      }

      await this.etapaRepository.eliminar(id);
      return { mensaje: 'Etapa eliminada correctamente' };
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
