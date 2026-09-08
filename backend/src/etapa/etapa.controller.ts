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
import { EtapaService } from './etapa.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CrearEtapaDto } from './dto/crear-etapa.dto';
import { ActualizarEtapaDto } from './dto/actualizar-etapa.dto';

@Controller('etapas')
@UseGuards(JwtAuthGuards, RolesGuard)
export class EtapaController {
  constructor(private readonly etapaService: EtapaService) {}

  // 1. Crear una nueva etapa
  @Post('nueva')
  @Roles('Administrador', 'Usuario')
  async crear(
    @Body() crearEtapaDto: CrearEtapaDto,
    @Req() request: { user?: { id: string } },
  ) {
    const usuarioId = request.user!.id;

    return this.etapaService.crear(crearEtapaDto, usuarioId);
  }

  // 2. Lista mis etapas
  @Get()
  @Roles('Administrador', 'Usuario')
  async listar(
    @Query('rutaId') rutaId: string | undefined,
    @Req() request: { user?: { id: string } },
  ) {
    const usuarioId = request.user!.id;

    return this.etapaService.listar(usuarioId, rutaId);
  }

  // 3. Obtener una etapa por su ID
  @Get(':id')
  @Roles('Administrador', 'Usuario')
  async obtenerPorId(
    @Param('id') id: string,
    @Req() request: { user?: { id: string } },
  ) {
    const usuarioId = request.user!.id;

    return this.etapaService.obtenerPorId(id, usuarioId);
  }

  // 4. Actualizar una etapa
  @Patch(':id')
  @Roles('Administrador', 'Usuario')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarEtapaDto: ActualizarEtapaDto,
    @Req() request: { user?: { id: string } },
  ) {
    const usuarioId = request.user!.id;

    return this.etapaService.actualizar(id, actualizarEtapaDto, usuarioId);
  }

  // 5. Eliminar una etapa
  @Delete(':id')
  @Roles('Administrador', 'Usuario')
  async eliminar(
    @Param('id') id: string,
    @Req() request: { user?: { id: string } },
  ) {
    const usuarioId = request.user!.id;

    return this.etapaService.eliminar(id, usuarioId);
  }
}
