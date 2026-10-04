import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { USUARIO_REPOSITORY } from '../common/usuario-repository.token';
import type { UsuarioRepository } from '../../domain/repositories/usuario.repository';

export class EliminarUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}
  async ejecutar(
    id: string,
    usuarioActualId: string,
  ): Promise<{ mensaje: string }> {
    try {
      const usuario = await this.usuarioRepository.obtenerPorId(id);

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      if (usuario.id === usuarioActualId) {
        throw new BadRequestException('No puedes eliminar tu propio usuario');
      }

      if (!usuario.activo) {
        throw new BadRequestException('El usuario ya se encuentra inactivo.');
      }

      await this.usuarioRepository.eliminar(id);

      return { mensaje: 'Usuario eliminado correctamente' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }
}
