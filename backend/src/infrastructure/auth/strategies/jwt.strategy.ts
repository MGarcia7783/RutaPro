import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { USUARIO_REPOSITORY } from '../../../application/common/usuario-repository.token';
import type { UsuarioRepository } from '../../../domain/repositories/usuario.repository';
import { JwtPayload } from '../../../application/auth/interface/jwt-payload.interface';
import { AuthUser } from '../../../application/auth/interface/auth-user.interface';

// Validar y determinar quién es el usuario autenticado
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,

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
  async validate(payload: JwtPayload): Promise<AuthUser> {
    // Verificar que el payload contenga los datos necesarios
    if (!payload?.sub || !payload?.email || !payload?.rolId) {
      throw new UnauthorizedException('Token inváido');
    }

    // Buscar el usuario y el rol
    const resultado = await this.usuarioRepository.obtenerPorIdConRol(
      payload.sub,
    );

    if (!resultado) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verficiar que el usuario esté activo
    if (!resultado.usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return {
      id: resultado.usuario.id,
      email: resultado.usuario.email,
      rol: resultado.rol,
    };
  }
}
