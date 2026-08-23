import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// Validar y determinar quién es el usuario autenticado
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // No permite utilizar un token expirado
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // Verificar que el payload contenga los datos necesarios
  async validate(payload: JwtPayload) {
    if (!payload?.sub || !payload?.email) {
      throw new UnauthorizedException('Token inváido');
    }

    // Buscar el usuario en la base de datos
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: payload.sub,
      },
      include: {
        rol: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol.nombre,
    };
  }
}
