import { Inject } from '@nestjs/common';
import type { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { USUARIO_REPOSITORY } from '../common/usuario-repository.token';
import { Usuario } from '../../domain/entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { UsuarioResponseDto } from './dto/usuario-response.dto';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

export class CrearUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async ejecutar(
    nombre: string,
    email: string,
    password: string,
    rolId: string,
    activo: boolean = true,
  ): Promise<UsuarioResponseDto> {
    try {
      // Hashear la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Crear usuario
      const usuario = new Usuario(
        crypto.randomUUID(),
        nombre,
        email,
        passwordHash,
        rolId,
        new Date(),
        new Date(),
        activo,
      );

      const usuarioCreado = await this.usuarioRepository.crear(usuario);

      return new UsuarioResponseDto(usuarioCreado);
    } catch (error) {
      PrismaErrorHelper.manejar(error);
    }
  }
}
