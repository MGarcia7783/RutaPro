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
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsuarioService } from './usuario.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { ListarUsuariosQueryDto } from './dto/listar-usuarios-query.dto';

@Controller('usuarios')
// @UseGuards a nivel del controlador, todos los endpoint requieren autenticación JWT
@UseGuards(JwtAuthGuards, RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // CREAR USUARIO
  @Post('nuevo')
  @Roles('Administrador')
  async crear(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return this.usuarioService.crearUsuario(crearUsuarioDto);
  }

  // LISTAR USUARIOS
  @Get()
  @Roles('Administrador')
  async listar(@Query() dto: ListarUsuariosQueryDto) {
    return this.usuarioService.listarUsuarios(dto);
  }

  // OBTENER USUARIO POR ID
  @Get(':id')
  @Roles('Administrador')
  async obtener(@Param('id') id: string) {
    return this.usuarioService.obtenerUsuarioPorId(id);
  }

  // ACTUALIZAR USUARIO
  @Patch(':id')
  @Roles('Administrador')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
  ) {
    return this.usuarioService.actualizarUsuario(id, actualizarUsuarioDto);
  }

  // ELIMINAR USUARIO
  // Eliminación lógica (soft delete)
  @Delete(':id')
  @Roles('Administrador')
  async eliminarUsuario(
    @Param('id') id: string,
    @Req() request: { user?: { id: string; email: string; rol: string } },
  ) {
    return this.usuarioService.eliminarUsuario(id, request.user!.id);
  }
}
