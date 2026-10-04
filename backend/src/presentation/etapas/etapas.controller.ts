import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CrearEtapaUseCase } from '../../application/etapas/crear-etapa.use-case';
import { ListarEtapasUseCase } from '../../application/etapas/listar-etapas.use-case';
import { ObtenerEtapaUseCase } from '../../application/etapas/obtener-etapa.use-case';
import { ActualizarEtapaUseCase } from '../../application/etapas/actualizar-etapa.use-case';
import { EliminarEtapaUseCase } from '../../application/etapas/eliminar-etapa.use-case';
import { Roles } from '../../infrastructure/auth/decorators/roles.decorator';
import { CrearEtapaDto } from './dto/crear-etapa.dto';
import { ListarEtapasDto } from './dto/listar-etapas.dto';
import { ActualizarEtapaDto } from './dto/actualizar-etapa.dto';
import { JwtAuthGuards } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/guards/roles.guard';

@Controller('etapas')
@UseGuards(JwtAuthGuards, RolesGuard)
export class EtapasController {
  constructor(
    private readonly crearEtapaUseCase: CrearEtapaUseCase,
    private readonly listarEtapasUseCase: ListarEtapasUseCase,
    private readonly obtenerEtapaUseCase: ObtenerEtapaUseCase,
    private readonly actualizarEtapaUseCase: ActualizarEtapaUseCase,
    private readonly eliminarEtapaUseCase: EliminarEtapaUseCase,
  ) {}

  // Crear nueva etapa de aprendizaje
  @Post('nueva')
  @Roles('Administrador', 'Usuario')
  async crear(
    @Body() dto: CrearEtapaDto,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.crearEtapaUseCase.ejecutar(
      dto.nombre,
      dto.descripcion || null,
      dto.rutaId,
      usuarioId,
      rol,
    );
  }

  // Listar todas las etapas de aprendizaje
  @Get('listar')
  @Roles('Administrador', 'Usuario')
  async listar(
    @Query() dto: ListarEtapasDto,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.listarEtapasUseCase.ejecutar(
      usuarioId,
      rol,
      dto.nombre,
      dto.pagina,
      dto.limite,
    );
  }

  // Obtener una etapa de aprendizaje por su ID
  @Get('obtener/:id')
  @Roles('Administrador', 'Usuario')
  async obtener(
    @Param('id') id: string,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.obtenerEtapaUseCase.ejecutar(id, usuarioId, rol);
  }

  // Actualizar una etapa de aprendizaje
  @Patch('actualizar/:id')
  @Roles('Administrador', 'Usuario')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarEtapaDto,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.actualizarEtapaUseCase.ejecutar(
      id,
      dto.nombre,
      dto.descripcion,
      usuarioId,
      rol,
    );
  }

  // Eliminar una etapa de aprendizaje
  @Delete('eliminar/:id')
  @Roles('Administrador', 'Usuario')
  async eliminar(
    @Param('id') id: string,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.eliminarEtapaUseCase.ejecutar(id, usuarioId, rol);
  }
}
