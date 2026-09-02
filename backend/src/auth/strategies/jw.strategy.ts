import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

// Validar y determinar quién es el usuario autenticado
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      // Obtener el JWT desde Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // No permite utilizar un token expirado
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // Verificar y obtener el usuario asociado al JWT
  async validate(payload: JwtPayload) {
    // Verificar que el payload contenga los datos necesarios
    if (!payload?.sub || !payload?.email || !payload?.rolId) {
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

    // Verficar que el usuario exista
    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    // Verficar que el usuario esté activo
    if (!usuario.activo) {
      throw new UnauthorizedException('El usuario está inactivo');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol.nombre,
    };
  }
}
