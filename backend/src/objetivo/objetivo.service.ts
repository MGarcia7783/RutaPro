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
    try {
      // Verificar que la etapa exista y pertenezca a una ruta del usuario
      const etapa = await this.prismaService.etapa.findFirst({
        where: {
          id: crearObjetivoDto.etapaId,
          ruta: {
            usuarioId,
          },
        },
      });

      if (!etapa) {
        throw new NotFoundException(
          'La etapa no existe o no pertenece al usuario autenticado',
        );
      }

      // Crear objetivo
      return await this.prismaService.objetivo.create({
        data: {
          titulo: crearObjetivoDto.titulo,
          descripcion: crearObjetivoDto.descripcion,
          etapaId: crearObjetivoDto.etapaId,
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
          etapa: {
            ruta: {
              usuarioId,
            },
          },
        },
        orderBy: {
          titulo: 'asc',
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
          titulo: 'asc',
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
          etapa: {
            ruta: {
              usuarioId,
            },
          },
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
      // Verificar que el objetivo pertenece al usuario autenticado
      await this.obtenerObjetivoPorId(id, usuarioId);

      return await this.prismaService.objetivo.update({
        where: { id },
        data: {
          titulo: actualizarObjetivoDto.titulo,
          descripcion: actualizarObjetivoDto.descripcion,
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
          'Ya existe un objetivo con ese mismo título en esta etapa',
        );
      }

      throw new InternalServerErrorException('Error al actualizar el objetivo');
    }
  }

  // 6. ELIMINAR UN OBJETIVO
  async eliminarObjetivo(id: string, usuarioId: string) {
    try {
      // Verificar si el objetivo existe
      await this.obtenerObjetivoPorId(id, usuarioId);

      const tareasRelacionadas = await this.prismaService.tarea.count({
        where: {
          objetivoId: id,
        },
      });

      if (tareasRelacionadas > 0) {
        throw new ConflictException(
          'No se puede eliminar el objetivo porque tiene tareas relacionadas',
        );
      }

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
