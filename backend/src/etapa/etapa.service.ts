import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearEtapaDto } from './dto/crear-etapa.dto';
import { Prisma } from '../generated/prisma/client';
import { ActualizarEtapaDto } from './dto/actualizar-etapa.dto';

@Injectable()
export class EtapaService {
  constructor(private readonly prismaService: PrismaService) {}

  // 1. Crear una nueva etapa
  async crear(crearEtapa: CrearEtapaDto, usuarioId: string) {
    try {
      // Verificar que la ruta exista y pertenezca al usuario
      const ruta = await this.prismaService.ruta.findFirst({
        where: {
          id: crearEtapa.rutaId,
          usuarioId,
        },
      });

      if (!ruta) {
        throw new Error('La ruta no existe o no pertenece al usuario');
      }

      // Obtener la última etapa de la ruta para determinar el orden
      const ultimaEtapa = await this.prismaService.etapa.findFirst({
        where: {
          rutaId: crearEtapa.rutaId,
        },
        orderBy: {
          orden: 'desc',
        },
      });

      // Calcular el siguiente orden para la nueva etapa
      const siguienteOrden = ultimaEtapa ? ultimaEtapa.orden + 1 : 1;

      // Crear la nueva etapa
      return await this.prismaService.etapa.create({
        data: {
          nombre: crearEtapa.nombre,
          descripcion: crearEtapa.descripcion,
          rutaId: crearEtapa.rutaId,
          orden: siguienteOrden,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ya existe una etapa con ese nombre en esta ruta',
        );
      }
      throw new Error('Error al crear la etapa');
    }
  }

  // 2. Obtener mis etapas
  async listar(usuarioId: string, rutaId?: string) {
    try {
      return await this.prismaService.etapa.findMany({
        where: {
          ruta: {
            usuarioId,
            ...(rutaId && { id: rutaId }),
          },
        },
        orderBy: {
          orden: 'asc',
        },
      });
    } catch {
      throw new InternalServerErrorException('Error al listar las etapas');
    }
  }

  // 3. Obtener una etapa por su ID
  async obtenerPorId(id: string, usuarioId: string) {
    try {
      const etapa = await this.prismaService.etapa.findFirst({
        where: {
          id,
          ruta: {
            usuarioId,
          },
        },
      });

      if (!etapa) {
        throw new NotFoundException(
          'La etapa no existe o no pertenece al usuario',
        );
      }

      return etapa;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la etapa');
    }
  }

  // 4. Actualizar una etapa
  async actualizar(
    id: string,
    actualizarEtapa: ActualizarEtapaDto,
    usuarioId: string,
  ) {
    try {
      // Verificar que la etapa exista y pertenezca al usuario
      await this.obtenerPorId(id, usuarioId);

      // Actualizar la etapa
      return await this.prismaService.etapa.update({
        where: { id },
        data: actualizarEtapa,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar la etapa');
    }
  }

  // 5. Eliminar una etapa
  async eliminar(id: string, usuarioId: string) {
    try {
      // Verificar que la etapa exista y pertenezca al usuario
      await this.obtenerPorId(id, usuarioId);

      const objetivosRelacionados = await this.prismaService.objetivo.count({
        where: { etapaId: id },
      });

      if (objetivosRelacionados > 0) {
        throw new ConflictException(
          'No se puede eliminar la etapa porque tiene objetivos relacionados',
        );
      }

      // Eliminar la etapa
      await this.prismaService.etapa.delete({
        where: { id },
      });

      return { message: 'Etapa eliminada correctamente' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar la etapa');
    }
  }
}
