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
import { JwtAuthGuards } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/guards/roles.guard';
import { CrearRutaUseCase } from '../../application/rutas/crear-ruta.use-case';
import { ListarRutasUseCase } from '../../application/rutas/listar-rutas.use-case';
import { ObtenerRutaUseCase } from '../../application/rutas/obtener-ruta.use-case';
import { ActualizarRutaUseCase } from '../../application/rutas/actualizar-ruta.use-case';
import { EliminarRutaUseCase } from '../../application/rutas/eliminar-ruta.use-case';
import { Roles } from '../../infrastructure/auth/decorators/roles.decorator';
import { CrearRutaDto } from './dto/crear-ruta.dto';
import { ActualizarRutaDto } from './dto/actualizar-ruta.dto';
import { ListarRutasDto } from './dto/listar-rutas.dto';

@Controller('rutas')
@UseGuards(JwtAuthGuards, RolesGuard)
export class RutasController {
  constructor(
    private readonly crearRutaUseCase: CrearRutaUseCase,
    private readonly listarRutasUseCase: ListarRutasUseCase,
    private readonly obtenerRutaUseCase: ObtenerRutaUseCase,
    private readonly actualizarRutaUseCase: ActualizarRutaUseCase,
    private readonly eliminarRutaUseCase: EliminarRutaUseCase,
  ) {}

  // Crear nueva ruta de aprendizaje
  @Post('nueva')
  @Roles('Administrador', 'Usuario')
  async crear(
    @Body() dto: CrearRutaDto,
    @Req() request: { user: { id: string } },
  ) {
    const usuarioId = request.user.id;

    return this.crearRutaUseCase.ejecutar(
      dto.nombre,
      dto.descripcion,
      usuarioId,
    );
  }

  // Listar las rutas de aprendizaje
  @Get('listar')
  @Roles('Administrador', 'Usuario')
  async listar(
    @Query() dto: ListarRutasDto,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.listarRutasUseCase.ejecutar(
      dto.nombre,
      usuarioId,
      rol,
      dto.pagina,
      dto.limite,
    );
  }

  // Obtener una ruta de aprendizaje por su ID
  @Get('obtener/:id')
  @Roles('Administrador', 'Usuario')
  async obtenerPorId(
    @Param('id') id: string,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.obtenerRutaUseCase.ejecutar(id, usuarioId, rol);
  }

  // Actualizar una ruta de aprendizaje existente
  @Patch('actualizar/:id')
  @Roles('Administrador', 'Usuario')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarRutaDto,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.actualizarRutaUseCase.ejecutar(
      id,
      dto.nombre,
      dto.descripcion,
      usuarioId,
      rol,
    );
  }

  // Eliminar una ruta de aprendizaje existente
  @Delete('eliminar/:id')
  @Roles('Administrador', 'Usuario')
  async eliminar(
    @Param('id') id: string,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.eliminarRutaUseCase.ejecutar(id, usuarioId, rol);
  }
}
