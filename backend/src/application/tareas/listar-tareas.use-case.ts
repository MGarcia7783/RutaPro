import { Inject, InternalServerErrorException } from '@nestjs/common';
import type { TareaRepository } from '../../domain/repositories/tarea.repository';
import { TAREA_REPOSITORY } from '../common/tarea-repository.token';
import { ResultadoPaginado } from '../../domain/common/resultado-paginado';
import { Tarea } from '../../domain/entities/tarea.entity';

export class ListarTareasUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}
  async ejecutar(
    titulo: string | undefined,
    usuarioId: string,
    rol: string,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Tarea & { usuario: string }>> {
    try {
      // Si el rol es Administrador, no filtramos por usuarioId
      const filtroUsuarioId = rol === 'Administrador' ? undefined : usuarioId;

      return await this.tareaRepository.listar(
        titulo,
        filtroUsuarioId,
        pagina,
        limite,
      );
    } catch {
      throw new InternalServerErrorException('Error al listar las tareas');
    }
  }
}
