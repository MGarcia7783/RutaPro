import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ObtenerProgresoUseCase } from '../../application/progreso/obtener-progreso.use-case';
import { JwtAuthGuards } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/guards/roles.guard';
import { Roles } from '../../infrastructure/auth/decorators/roles.decorator';

@Controller('progreso')
@UseGuards(JwtAuthGuards, RolesGuard)
export class ProgresoController {
  constructor(
    private readonly obtenerProgresoUseCase: ObtenerProgresoUseCase,
  ) {}

  // 1. Obtener el progreso de una ruta específica
  @Get(':rutaId')
  @Roles('Administrador', 'Usuario')
  async obtener(
    @Param('rutaId') rutaId: string,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.obtenerProgresoUseCase.ejecutar(rutaId, usuarioId, rol);
  }
}
