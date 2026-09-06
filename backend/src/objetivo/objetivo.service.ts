import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearObjetivoDto } from './dto/crear-objetivo.dto';
import { ActualizarObjetivoDto } from './dto/actualizar-objetivo.dto';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class ObjetivoService {
  constructor(private readonly prismaService: PrismaService) {}

  // 1. CREAR UN OBJETIVO PARA USUARIO AUTENTICADO
  async createObjetivo(crearObjetivoDto: CrearObjetivoDto, usuarioId: string) {
    // Verificar que la ruta de aprendizaje exista
    const ruta = await this.prismaService.ruta.findUnique({
      where: {
        id: crearObjetivoDto.rutaId,
      },
    });

    if (!ruta) {
      throw new NotFoundException('La ruta de aprendizaje no existe');
    }

    try {
      // Crear objetivo y la relación con la ruta en una transacción
      return await this.prismaService.$transaction(async (tx) => {
        // Crear el objetivo
        const objetivo = await tx.objetivo.create({
          data: {
            titulo: crearObjetivoDto.titulo,
            descripcion: crearObjetivoDto.descripcion,

            // El propietario se obtiene del JWT
            usuarioId,
          },
        });

        // Asociar el objetivo a la ruta de aprendizaje
        await tx.objetivoRuta.create({
          data: {
            objetivoId: objetivo.id,
            rutaId: crearObjetivoDto.rutaId,
          },
        });

        return objetivo;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ya tienes un objetivo con ese mismo título',
        );
      }
      throw new InternalServerErrorException('Error al crear el objetivo');
    }
  }

  // 2. LISTAR MIS OBJETIVOS
  async listarMisObjetivos(usuarioId: string) {
    try {
      return await this.prismaService.objetivo.findMany({
        where: {
          usuarioId,
        },
        orderBy: {
          creadoEn: 'desc',
        },
      });
    } catch {
      throw new InternalServerErrorException('Error al listar los objetivos');
    }
  }

  // 3. LISTAR TODOS LOS OBJETIVOS (ADMIN)
  async listarTodosLosObjetivos() {
    try {
      return await this.prismaService.objetivo.findMany({
        orderBy: {
          creadoEn: 'desc',
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Error al listar todos los objetivos',
      );
    }
  }

  // 4. OBTENER UN OBJETIVO POR ID
  async obtenerObjetivoPorId(id: string, usuarioId: string) {
    try {
      const objetivo = await this.prismaService.objetivo.findFirst({
        where: {
          id,
          usuarioId,
        },
      });

      // Verificar si el objetivo existe
      if (!objetivo) {
        throw new NotFoundException('Objetivo no encontrado');
      }

      return objetivo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'No fue posible obtener el objetivo',
      );
    }
  }

  // 5. ACTUALIZAR UN OBJETIVO
  async actualizarObjetivo(
    id: string,
    actualizarObjetivoDto: ActualizarObjetivoDto,
    usuarioId: string,
  ) {
    try {
      // Verificar si el objetivo existe
      await this.obtenerObjetivoPorId(id, usuarioId);

      return await this.prismaService.objetivo.update({
        where: { id },
        data: {
          titulo: actualizarObjetivoDto.titulo,
          descripcion: actualizarObjetivoDto.descripcion,
          completado: actualizarObjetivoDto.completado,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error al actualizar el objetivo');
    }
  }

  // 6. ELIMINAR UN OBJETIVO
  async eliminarObjetivo(id: string, usuarioId: string) {
    try {
      // Verificar si el objetivo existe
      await this.obtenerObjetivoPorId(id, usuarioId);

      // Eliminar el objetivo
      await this.prismaService.objetivo.delete({
        where: { id },
      });

      return { message: 'Objetivo eliminado correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error al eliminar el objetivo');
    }
  }
}
