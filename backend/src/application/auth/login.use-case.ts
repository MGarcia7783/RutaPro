import {
  Inject,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import type { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { USUARIO_REPOSITORY } from '../common/usuario-repository.token';
import { REFRESH_TOKEN_REPOSITORY } from '../common/refresh-token-repository.token';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { JwtPayload } from './interface/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

export class LoginUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,

    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  async ejecutar(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    usuario: { id: string; nombre: string; email: string };
  }> {
    try {
      // Buscar el usuario por email
      const usuario = await this.usuarioRepository.buscarPorEmail(email);

      if (!usuario || !usuario.passwordHash) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar que el usuario esté activo
      if (!usuario.activo) {
        throw new UnauthorizedException('El usuario está inactivo');
      }

      // Comparar la contraaseña con el hash almacenado en la base de datos
      const passwordValida = await bcrypt.compare(
        password,
        usuario.passwordHash,
      );

      if (!passwordValida) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Información que se almacenará dentro del JWT
      const payload: JwtPayload = {
        // Sub = subject
        // Identifica al usuario al que pertenece el token
        sub: usuario.id,
        email: usuario.email,
        rolId: usuario.rolId,
      };

      // Generar access token
      const accessToken = this.jwtService.sign(payload);

      // Obtener la cantidad de días para la expiración del refresh token
      const diasRefreshToken = Number(
        this.configService.getOrThrow<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION_DAYS',
        ),
      );

      const refreshToken = this.jwtService.sign(
        {
          sub: usuario.id,
        },
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: diasRefreshToken * 24 * 60 * 60,
        },
      );

      // Generar hash del refresh token
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      // Crear entidad RefreshToken
      const refreshTokenEntity = new RefreshToken(
        crypto.randomUUID(),
        refreshTokenHash,
        usuario.id,
        new Date(Date.now() + diasRefreshToken * 24 * 60 * 60 * 1000),
        new Date(),
      );

      // Guardar el Refresh Token mediante el repositorio
      await this.refreshTokenRepository.crear(refreshTokenEntity);

      return {
        accessToken,
        refreshToken,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Error al iniciar sesión');
    }
  }
}
