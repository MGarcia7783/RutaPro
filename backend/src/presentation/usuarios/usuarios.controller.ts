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
import { CrearUsuarioUseCase } from '../../application/usuarios/crear-usuario.use-case';
import { ObtenerUsuarioUseCase } from '../../application/usuarios/obtener-usuario.use-case';
import { ActualizarUsuarioUseCase } from '../../application/usuarios/actualizar-usuario.use-case';
import { EliminarUsuarioUseCase } from '../../application/usuarios/eliminar-usuario.use-case';
import { ListarUsuarioUseCase } from '../../application/usuarios/listar-usuario.use-case';
import { Roles } from '../../infrastructure/auth/decorators/roles.decorator';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { ListarUsuariosDto } from './dto/listar-usuarios.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuards, RolesGuard)
export class UsuariosController {
  constructor(
    private readonly crearUsuarioUseCase: CrearUsuarioUseCase,
    private readonly listarUsuarioUseCase: ListarUsuarioUseCase,
    private readonly obtenerUsuarioUseCase: ObtenerUsuarioUseCase,
    private readonly actualizarUsuarioUseCase: ActualizarUsuarioUseCase,
    private readonly eliminarUsuarioUseCase: EliminarUsuarioUseCase,
  ) {}

  // Crear un nuevo usuario
  @Post('nuevo')
  @Roles('Administrador')
  async crear(@Body() dto: CrearUsuarioDto) {
    return this.crearUsuarioUseCase.ejecutar(
      dto.nombre,
      dto.email,
      dto.password,
      dto.rolId,
    );
  }

  // Listar usuarios con filtros y paginación
  @Get('listar')
  @Roles('Administrador')
  async listar(@Query() dto: ListarUsuariosDto) {
    return this.listarUsuarioUseCase.ejecutar(
      dto.nombre,
      dto.activo,
      dto.pagina,
      dto.limite,
    );
  }

  // Obtener un usuario por su ID
  @Get('obtener/:id')
  @Roles('Administrador')
  async obtener(@Param('id') id: string) {
    return this.obtenerUsuarioUseCase.ejecutar(id);
  }

  // Actualizar un usuario existente
  @Patch('actualizar/:id')
  @Roles('Administrador')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarUsuarioDto) {
    return this.actualizarUsuarioUseCase.ejecutar(id, dto.rolId, dto.activo);
  }

  // Eliminar un usuario por su ID
  @Delete('eliminar/:id')
  @Roles('Administrador')
  async eliminar(
    @Param('id') id: string,
    @Req() request: { user: { id: string; email: string; rol: string } },
  ) {
    return this.eliminarUsuarioUseCase.ejecutar(id, request.user.id);
  }
}
