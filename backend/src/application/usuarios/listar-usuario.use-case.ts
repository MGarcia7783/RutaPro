import { Inject, InternalServerErrorException } from '@nestjs/common';
import type { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { USUARIO_REPOSITORY } from '../common/usuario-repository.token';
import { ResultadoPaginado } from '../../domain/common/resultado-paginado';
import { UsuarioResponseDto } from './dto/usuario-response.dto';

export class ListarUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async ejecutar(
    texto: string | undefined,
    activo: boolean | undefined,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<UsuarioResponseDto>> {
    try {
      const listado = await this.usuarioRepository.listar(
        texto,
        activo,
        pagina,
        limite,
      );

      return {
        ...listado,
        // Mapear los datos a UsuarioResponseDto
        datos: listado.datos.map(
          (item) => new UsuarioResponseDto(item.usuario, item.rol),
        ),
      };
    } catch {
      throw new InternalServerErrorException('Error al listar usuarios');
    }
  }
}
