import {
  Inject,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { JsonWebTokenError } from 'jsonwebtoken';

import * as bcrypt from 'bcrypt';

import type { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';

import { USUARIO_REPOSITORY } from '../common/usuario-repository.token';
import { REFRESH_TOKEN_REPOSITORY } from '../common/refresh-token-repository.token';

interface RefreshTokenPayload {
  sub: string;
}

export class RefreshTokenUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,

    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  async ejecutar(refreshToken: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );

      const usuario = await this.usuarioRepository.obtenerPorId(payload.sub);

      if (!usuario) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      if (!usuario.activo) {
        throw new UnauthorizedException('El usuario está inactivo');
      }

      await this.refreshTokenRepository.eliminarExpirados(usuario.id);

      const tokensVigentes = await this.refreshTokenRepository.buscarVigentes(
        usuario.id,
      );

      // Verificar si el refresh token proporcionado coincide con alguno de los tokens vigentes
      for (const token of tokensVigentes) {
        if (await bcrypt.compare(refreshToken, token.tokenHash)) {
          return this.jwtService.sign({
            sub: usuario.id,
            email: usuario.email,
            rolId: usuario.rolId,
          });
        }
      }

      // Si no se encuentra un token coincidente, se considera inválido
      throw new UnauthorizedException('Refresh token inválido');
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof JsonWebTokenError
      ) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      throw new InternalServerErrorException(
        'Error al renovar el token de acceso',
      );
    }
  }
}
