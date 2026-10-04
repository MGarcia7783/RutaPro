import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { USUARIO_REPOSITORY } from '../common/usuario-repository.token';
import type { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import type { RolRepository } from '../../domain/repositories/rol.repository';

import * as bcrypt from 'bcrypt';
import { Usuario } from '../../domain/entities/usuario.entity';
import { ROL_REPOSITORY } from '../common/rol-repository.token';
import { UsuarioResponseDto } from '../usuarios/dto/usuario-response.dto';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';

export class RegisterUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,

    @Inject(ROL_REPOSITORY)
    private readonly rolRepository: RolRepository,
  ) {}

  async ejecutar(
    nombre: string,
    email: string,
    password: string,
  ): Promise<{
    mensaje: string;
    usuario: UsuarioResponseDto;
  }> {
    try {
      // Buscar el rol del usuario
      const rolUsuario = await this.rolRepository.buscarPorNombre('Usuario');

      if (!rolUsuario) {
        throw new NotFoundException(
          'Rol Usuario no existe en la base de datos',
        );
      }

      // Generar hash de contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Crear el usuario
      const usuario = new Usuario(
        crypto.randomUUID(),
        nombre,
        email,
        passwordHash,
        rolUsuario.id,
        new Date(),
        new Date(),
      );

      // Guardar el usuario en el repositorio
      const usuarioCreado = await this.usuarioRepository.crear(usuario);

      return {
        mensaje: 'Usuario registrado exitosamente',
        usuario: new UsuarioResponseDto(usuarioCreado),
      };
    } catch (error) {
      // console.log('ERROR REGISTRO:', error);
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      PrismaErrorHelper.manejar(error);
    }
  }
}
