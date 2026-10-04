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
import { CrearTareaUseCase } from '../../application/tareas/crear-tarea.use-case';
import { CrearTareaDto } from './dto/crear-tarea.dto';
import { JwtAuthGuards } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/guards/roles.guard';
import { Roles } from '../../infrastructure/auth/decorators/roles.decorator';
import { ListarTareasUseCase } from '../../application/tareas/listar-tareas.use-case';
import { ObtenerTareaUseCase } from '../../application/tareas/obtener-tarea.use-case';
import { ActualizarTareaUseCase } from '../../application/tareas/actualizar-tarea.use-case';
import { EliminarTareaUseCase } from '../../application/tareas/eliminar-tarea.use-case';
import { ActualizarTareaDto } from './dto/actualizar-tarea.dto';
import { ListarTareasDto } from './dto/listar-tareas.dto';

@Controller('tareas')
@UseGuards(JwtAuthGuards, RolesGuard)
export class TareasController {
  constructor(
    private readonly crearTareaUseCase: CrearTareaUseCase,
    private readonly listarTareasUseCase: ListarTareasUseCase,
    private readonly obtenerTareaUseCase: ObtenerTareaUseCase,
    private readonly actualizarTareaUseCase: ActualizarTareaUseCase,
    private readonly eliminarTareaUseCase: EliminarTareaUseCase,
  ) {}

  // 1. Crear una nueva tarea
  @Post('nueva')
  @Roles('Administrador', 'Usuario')
  async crear(
    @Body() dto: CrearTareaDto,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.crearTareaUseCase.ejecutar(
      dto.titulo,
      dto.descripcion ?? null,
      dto.etapaId,
      usuarioId,
      rol,
    );
  }

  // 2. Listar tareas por usuario con paginación
  @Get('listar')
  @Roles('Administrador', 'Usuario')
  async listar(
    @Query() dto: ListarTareasDto,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.listarTareasUseCase.ejecutar(
      dto.titulo,
      usuarioId,
      rol,
      dto.pagina,
      dto.limite,
    );
  }

  // 3. Obtener una tarea por su ID
  @Get('obtener/:id')
  @Roles('Administrador', 'Usuario')
  async obtenerPorId(
    @Param('id') id: string,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.obtenerTareaUseCase.ejecutar(id, usuarioId, rol);
  }

  // 4. Actualizar una tarea existente
  @Patch('actualizar/:id')
  @Roles('Administrador', 'Usuario')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarTareaDto,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    return this.actualizarTareaUseCase.ejecutar(
      id,
      usuarioId,
      rol,
      dto.titulo,
      dto.descripcion,
      dto.completada,
    );
  }

  // 5. Eliminar una tarea por su ID
  @Delete('eliminar/:id')
  @Roles('Administrador', 'Usuario')
  async eliminar(
    @Param('id') id: string,
    @Req() request: { user: { id: string; rol: string } },
  ) {
    const usuarioId = request.user.id;
    const rol = request.user.rol;

    await this.eliminarTareaUseCase.ejecutar(id, usuarioId, rol);

    return {
      mensaje: 'Tarea eliminada correctamente',
    };
  }
}
