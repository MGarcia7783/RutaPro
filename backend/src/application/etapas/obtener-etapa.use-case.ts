import {
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ETAPA_REPOSITORY } from '../common/etapa-repository.token';
import type { EtapaRepository } from '../../domain/repositories/etapa.repository';
import { Etapa } from '../../domain/entities/etapa.entity';

export class ObtenerEtapaUseCase {
  constructor(
    @Inject(ETAPA_REPOSITORY)
    private readonly etapaRepository: EtapaRepository,
  ) {}

  async ejecutar(id: string, usuarioId: string, rol: string): Promise<Etapa> {
    try {
      const resultado = await this.etapaRepository.obtenerPorIdConRuta(id);

      if (!resultado) {
        throw new NotFoundException('Etapa no encontrada');
      }

      if (rol !== 'Administrador' && resultado.usuarioId !== usuarioId) {
        throw new ForbiddenException(
          'No tienes permiso para acceder a esta etapa',
        );
      }

      return resultado.etapa;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la etapa');
    }
  }
}
