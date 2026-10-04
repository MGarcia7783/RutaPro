import { TareaRepository } from '../../domain/repositories/tarea.repository';
import { PrismaService } from '../database/prisma/prisma.service';
import { Tarea } from '../../domain/entities/tarea.entity';
import { Prisma } from '../../generated/prisma/client';
import { ResultadoPaginado } from '../../domain/common/resultado-paginado';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaTareaRepository implements TareaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Crear una nueva tarea
  async crear(tarea: Tarea): Promise<Tarea> {
    const nuevaTarea = await this.prisma.tarea.create({
      data: {
        id: tarea.id,
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        completada: tarea.completada,
        etapaId: tarea.etapaId,
      },
    });
    return this.mapear(nuevaTarea);
  }

  // 2. Verificar si un usuario tiene acceso a una etapa específica
  async tieneAccesoEtapa(etapaId: string, usuarioId: string): Promise<boolean> {
    const etapa = await this.prisma.etapa.findFirst({
      where: {
        id: etapaId,
        ruta: {
          usuarioId,
        },
      },
    });

    return etapa !== null;
  }

  // 3. Listar tareas con paginación
  listar(
    titulo: string | undefined,
    usuarioId: string | undefined,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Tarea & { usuario: string }>> {
    const where: Prisma.TareaWhereInput = {};

    if (usuarioId !== undefined) {
      where.etapa = {
        ruta: {
          usuarioId: usuarioId,
        },
      };
    }

    if (titulo !== undefined) {
      where.titulo = {
        contains: titulo,
        mode: 'insensitive',
      };
    }

    return this.listaPaginada(where, pagina, limite);
  }

  // 4. Obtener una tarea por su ID junto con el ID del usuario asociado a la ruta
  async obtenerPorIdConRuta(
    id: string,
  ): Promise<{ tarea: Tarea; usuarioId: string; usuario: string } | null> {
    const resultado = await this.prisma.tarea.findUnique({
      where: { id },
      include: {
        etapa: {
          include: {
            ruta: {
              include: {
                usuario: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!resultado) {
      return null;
    }

    return {
      tarea: this.mapear(resultado),
      usuarioId: resultado.etapa.ruta.usuarioId,
      usuario: resultado.etapa.ruta.usuario.nombre,
    };
  }

  // 5. Actualizar una tarea existente
  async actualizar(tarea: Tarea): Promise<Tarea> {
    const tareaActualizada = await this.prisma.tarea.update({
      where: { id: tarea.id },
      data: {
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        completada: tarea.completada,
      },
    });
    return this.mapear(tareaActualizada);
  }

  // 6. Eliminar una tarea por su ID
  async eliminar(id: string): Promise<void> {
    await this.prisma.tarea.delete({
      where: { id },
    });
  }

  // #region Métodos privados

  // Método privado para mapear un objeto a una instancia de Tarea
  private mapear(tarea: Prisma.TareaGetPayload<null>): Tarea {
    return new Tarea(
      tarea.id,
      tarea.titulo,
      tarea.descripcion,
      tarea.etapaId,
      tarea.creadoEn,
      tarea.actualizadoEn,
      tarea.completada,
    );
  }

  // Método privado para listar tareas con paginación y filtrado
  private async listaPaginada(
    where: Prisma.TareaWhereInput,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Tarea & { usuario: string }>> {
    const skip = (pagina - 1) * limite;

    const [tareas, total] = await Promise.all([
      this.prisma.tarea.findMany({
        where,
        skip,
        take: limite,
        orderBy: {
          creadoEn: 'desc',
        },
        include: {
          etapa: {
            include: {
              ruta: {
                include: {
                  usuario: {
                    select: {
                      nombre: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.tarea.count({ where }),
    ]);

    return {
      datos: tareas.map((tarea) => ({
        ...this.mapear(tarea),
        usuario: tarea.etapa.ruta.usuario.nombre,
      })),
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }
}
