import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // obtener los roles definidos en el endpoind
    // medinate @Roles()
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si el endpoint no tiene @Roles(),
    // no se aplica ninguna restricción de rol
    if (!roles || roles.length === 0) {
      return true;
    }

    // Obtener el objeto request actual
    const request = context.switchToHttp().getRequest<{
      user?: {
        id: string;
        email: string;
        rol: string;
      };
    }>();

    // JwtStrategy coloca aqupi la información
    // del usuario autenticado
    const usuario = request.user;

    if (!usuario) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Revisar si el rol de usuario está dentro
    // de los roles permitidos
    const tieneRol = roles.includes(usuario.rol);

    if (!tieneRol) {
      throw new ForbiddenException(
        'No tienes permisos para accerder a este recurso',
      );
    }

    return true;
  }
}
