import { Inject, NotFoundException } from '@nestjs/common';
import { USUARIO_REPOSITORY } from '../common/usuario-repository.token';
import type { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { UsuarioResponseDto } from './dto/usuario-response.dto';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

export class ActualizarUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async ejecutar(
    id: string,
    rolId?: string,
    activo?: boolean,
  ): Promise<UsuarioResponseDto> {
    try {
      const usuario = await this.usuarioRepository.obtenerPorId(id);

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      if (rolId !== undefined) {
        usuario.rolId = rolId;
      }

      if (activo !== undefined) {
        usuario.activo = activo;
      }

      const usuarioActualizado =
        await this.usuarioRepository.actualizar(usuario);

      return new UsuarioResponseDto(usuarioActualizado);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      PrismaErrorHelper.manejar(error);
    }
  }
}
