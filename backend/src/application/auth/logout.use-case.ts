import {
  Inject,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { REFRESH_TOKEN_REPOSITORY } from '../common/refresh-token-repository.token';

interface RefreshTokenPayload {
  sub: string;
}

export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  async ejecutar(refreshToken: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );

      const tokens = await this.refreshTokenRepository.buscarVigentes(
        payload.sub,
      );

      for (const token of tokens) {
        if (await bcrypt.compare(refreshToken, token.tokenHash)) {
          await this.refreshTokenRepository.eliminar(token.id);
          return;
        }
      }
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof JsonWebTokenError
      ) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      throw new InternalServerErrorException('Error al cerrar sesión');
    }
  }
}
