import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { USUARIO_REPOSITORY } from '../common/usuario-repository.token';
import { UsuarioResponseDto } from './dto/usuario-response.dto';

export class ObtenerUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}
  async ejecutar(id: string): Promise<UsuarioResponseDto | null> {
    try {
      const resultado = await this.usuarioRepository.obtenerPorIdConRol(id);

      if (!resultado) {
        throw new NotFoundException('Usuario no encontrado');
      }

      //console.log('RESULTADO:', resultado);

      return new UsuarioResponseDto(resultado.usuario, resultado.rol);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error al obtener el usuario');
    }
  }
}
