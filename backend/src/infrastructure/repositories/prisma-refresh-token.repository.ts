import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { PrismaService } from '../database/prisma/prisma.service';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(refreshToken: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        id: refreshToken.id,
        tokenHash: refreshToken.tokenHash,
        usuarioId: refreshToken.usuarioId,
        expiracion: refreshToken.expiracion,
        revocado: refreshToken.revocado,
      },
    });
  }

  async eliminarExpirados(usuarioId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      // Eliminamos los tokens que hayan expirado para el usuario dado
      where: {
        usuarioId,
        expiracion: {
          lte: new Date(),
        },
      },
    });
  }

  async buscarVigentes(usuarioId: string): Promise<RefreshToken[]> {
    const tokens = await this.prisma.refreshToken.findMany({
      // Solo buscamos los tokens que no estén revocados y que no hayan expirado
      where: {
        usuarioId,
        expiracion: {
          gt: new Date(),
        },
        revocado: false,
      },
    });

    return tokens.map((token) => this.mapear(token));
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: {
        id,
      },
    });
  }

  // Método privado para mapear
  private mapear(token: Prisma.RefreshTokenGetPayload<null>): RefreshToken {
    return new RefreshToken(
      token.id,
      token.tokenHash,
      token.usuarioId,
      token.expiracion,
      token.creadoEn,
      token.revocado,
    );
  }
}
