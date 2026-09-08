import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearRutaDto } from './dto/crear-ruta.dto';
import { ActualizarRutaDto } from './dto/actualizar-ruta.dto';
import { ListarRutasQueryDto } from './dto/listar-rutas-query.dto';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class RutaService {
  constructor(private prismaService: PrismaService) {}

  // Crear una nueva ruta de aprendizaje
  async crear(crearRutaDto: CrearRutaDto, usuarioId: string) {
    try {
      return await this.prismaService.ruta.create({
        data: {
          nombre: crearRutaDto.nombre,
          descripcion: crearRutaDto.descripcion,
          usuarioId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ya existe una ruta de aprendizaje con ese nombre',
        );
      }
      throw new InternalServerErrorException(
        'Error al crear la ruta de aprendizaje',
      );
    }
  }

  // Listar todas las rutas de aprendizaje
  async listar(dto: ListarRutasQueryDto, usuarioId: string) {
    const { pagina, limite, nombre, ordenarPor, orden } = dto;

    const where = {
      usuarioId,
      ...(nombre && {
        nombre: { contains: nombre, mode: 'insensitive' as const },
      }),
    };

    try {
      const [rutas, total] = await Promise.all([
        this.prismaService.ruta.findMany({
          where,
          skip: (pagina - 1) * limite,
          take: limite,
          orderBy: {
            [ordenarPor]: orden,
          },
        }),
        this.prismaService.ruta.count({ where }),
      ]);

      return {
        rutas,
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      };
    } catch {
      throw new InternalServerErrorException(
        'Error al listar las rutas de aprendizaje',
      );
    }
  }

  // Obtener una ruta específica mediante su ID
  async obtenerPorId(id: string, usuarioId: string) {
    try {
      const ruta = await this.prismaService.ruta.findUnique({
        where: {
          id,
          usuarioId,
        },
      });

      if (!ruta) {
        throw new NotFoundException('La ruta de aprendizaje no existe');
      }

      return ruta;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'No fue posible obtener la ruta de aprendizaje',
      );
    }
  }

  // Actualizar una ruta existente
  async actualizar(
    id: string,
    actualizarRutaDto: ActualizarRutaDto,
    usuarioId: string,
  ) {
    try {
      await this.obtenerPorId(id, usuarioId);

      return this.prismaService.ruta.update({
        where: {
          id,
        },
        data: actualizarRutaDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error al actualizar la ruta de aprendizaje',
      );
    }
  }

  // Eliminar una ruta existente
  async eliminar(id: string, usuarioId: string) {
    try {
      await this.obtenerPorId(id, usuarioId);

      const etapasRelacionadas = await this.prismaService.etapa.count({
        where: {
          rutaId: id,
        },
      });

      if (etapasRelacionadas > 0) {
        throw new ConflictException(
          'No se puede eliminar la ruta porque tiene etapas relacionadas',
        );
      }

      const progresosRelacionados = await this.prismaService.progreso.count({
        where: {
          rutaId: id,
        },
      });

      if (progresosRelacionados > 0) {
        throw new ConflictException(
          'No se puede eliminar la ruta porque tiene progresos relacionados',
        );
      }

      await this.prismaService.ruta.delete({
        where: { id },
      });

      return {
        message: 'Ruta eliminada correctamente',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error al eliminar la ruta de aprendizaje',
      );
    }
  }
}
