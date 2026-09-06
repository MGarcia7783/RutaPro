import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RutaService } from './ruta.service';
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CrearRutaDto } from './dto/crear-ruta.dto';
import { ActualizarRutaDto } from './dto/actualizar-ruta.dto';
import { ListarRutasQueryDto } from './dto/listar-rutas-query.dto';

@Controller('rutas')
@UseGuards(JwtAuthGuards, RolesGuard)
export class RutaController {
  constructor(private readonly rutaService: RutaService) {}

  // Crear ruta de aprendizaje
  @Post('nueva')
  @Roles('Administrador')
  async crear(@Body() crearRutaDto: CrearRutaDto) {
    return this.rutaService.crear(crearRutaDto);
  }

  // Listar todas las rutas de aprendizaje
  @Get()
  async listar(@Query() dto: ListarRutasQueryDto) {
    return this.rutaService.listar(dto);
  }

  // Obtener una ruta por Id
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.rutaService.obtenerPorId(id);
  }

  // Actualizar ruta de aprendizaje
  @Patch(':id')
  @Roles('Administrador')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarRutaDto: ActualizarRutaDto,
  ) {
    return this.rutaService.actualizar(id, actualizarRutaDto);
  }

  // Eliminar ruta de aprendizaje
  @Delete(':id')
  @Roles('Administrador')
  async eliminar(@Param('id') id: string) {
    return this.rutaService.eliminar(id);
  }

  // Listar objetivos asociados a una ruta de aprendizaje
  @Get(':id/objetivos')
  async listarObjetivos(@Param('id') rutaId: string) {
    return this.rutaService.listarObjetivosDeRuta(rutaId);
  }
}
