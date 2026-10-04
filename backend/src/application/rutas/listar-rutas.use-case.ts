import { Inject, InternalServerErrorException } from '@nestjs/common';
import { RUTA_REPOSITORY } from '../common/ruta-repository.token';
import type { RutaRepository } from '../../domain/repositories/ruta.repository';
import { ResultadoPaginado } from '../../domain/common/resultado-paginado';
import { Ruta } from '../../domain/entities/ruta.entity';

export class ListarRutasUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY)
    private readonly rutaRepository: RutaRepository,
  ) {}

  async ejecutar(
    nombre: string | undefined,
    usuarioId: string,
    rol: string,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Ruta & { usuario: string }>> {
    try {
      // Si el rol es "Administrador", no se filtra por usuarioId,
      // de lo contrario, se filtra por el usuarioId proporcionado.
      const filtroUsuarioId = rol === 'Administrador' ? undefined : usuarioId;

      return await this.rutaRepository.listar(
        nombre,
        filtroUsuarioId,
        pagina,
        limite,
      );
    } catch {
      throw new InternalServerErrorException('Error al listar las rutas');
    }
  }
}
