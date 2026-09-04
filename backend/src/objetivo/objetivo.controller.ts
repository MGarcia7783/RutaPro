import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ObjetivoService } from './objetivo.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CrearObjetivoDto } from './dto/crear-objetivo.dto';
import { ActualizarObjetivoDto } from './dto/actualizar-objetivo.dto';

@Controller('objetivos')
@UseGuards(JwtAuthGuards, RolesGuard)
export class ObjetivoController {
  constructor(private readonly objetivoService: ObjetivoService) {}

  // 1. CREAR UN OBJETIVO
  @Post('nuevo')
  @Roles('Administrador', 'Usuario')
  async crearObjetivo(
    @Body() crearObjetivoDto: CrearObjetivoDto,
    @Req() request: { user?: { id: string } },
  ) {
    const usuarioId = request.user!.id;

    return this.objetivoService.createObjetivo(crearObjetivoDto, usuarioId);
  }

  // 2. LISTAR MIS OBJETIVOS
  @Get()
  @Roles('Administrador', 'Usuario')
  async listarMisObjetivos(@Req() request: { user?: { id: string } }) {
    // Obtener el usuario autenticado desde el JWT
    const usuarioId = request.user!.id;

    return this.objetivoService.listarMisObjetivos(usuarioId);
  }

  // 3. LISTAR TODOS LOS OBJETIVOS
  @Get('todos')
  @Roles('Administrador')
  async listarTodosLosObjetivos() {
    return this.objetivoService.listarTodosLosObjetivos();
  }

  // 4. OBTENER OBJETIVO POR ID
  @Get(':id')
  @Roles('Administrador', 'Usuario')
  async obtenerObjetivoPorId(
    @Param('id') id: string,
    @Req() request: { user?: { id: string } },
  ) {
    // Obtener el usuario autenticado desde el JWT
    const usuarioId = request.user!.id;

    return this.objetivoService.obtenerObjetivoPorId(id, usuarioId);
  }

  // 5. ACTUALIZAR OBJETIVO
  @Patch(':id')
  @Roles('Administrador', 'Usuario')
  async actualizarObjetivo(
    @Param('id') id: string,
    @Body() actualizarObjetivoDto: ActualizarObjetivoDto,
    @Req() request: { user?: { id: string } },
  ) {
    // Obtener el usuario autenticado desde el JWT
    const usuarioId = request.user!.id;

    return this.objetivoService.actualizarObjetivo(
      id,
      actualizarObjetivoDto,
      usuarioId,
    );
  }

  // 6. ELIMINAR OBJETIVO
  @Delete(':id')
  @Roles('Administrador', 'Usuario')
  async eliminarObjetivo(
    @Param('id') id: string,
    @Req() request: { user?: { id: string } },
  ) {
    // Obtener el usuario autenticado desde el JWT
    const usuarioId = request.user!.id;

    return this.objetivoService.eliminarObjetivo(id, usuarioId);
  }
}
