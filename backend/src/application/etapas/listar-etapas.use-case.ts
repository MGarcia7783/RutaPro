import { Inject, InternalServerErrorException } from '@nestjs/common';
import { ETAPA_REPOSITORY } from '../common/etapa-repository.token';
import type { EtapaRepository } from '../../domain/repositories/etapa.repository';
import { ResultadoPaginado } from '../../domain/common/resultado-paginado';
import { Etapa } from '../../domain/entities/etapa.entity';

export class ListarEtapasUseCase {
  constructor(
    @Inject(ETAPA_REPOSITORY)
    private readonly etapaRepository: EtapaRepository,
  ) {}

  async ejecutar(
    usuarioId: string,
    rol: string,
    nombre: string | undefined,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Etapa>> {
    try {
      const filtroUsuarioId = rol === 'Administrador' ? undefined : usuarioId;

      return await this.etapaRepository.listar(
        filtroUsuarioId,
        nombre,
        pagina,
        limite,
      );
    } catch {
      throw new InternalServerErrorException('Error al listar las etapas');
    }
  }
}
