import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { RutaRepository } from '../../domain/repositories/ruta.repository';
import { ResultadoPaginado } from '../../domain/common/resultado-paginado';
import { Ruta } from '../../domain/entities/ruta.entity';
import { Prisma, Progreso } from '../../generated/prisma/client';

@Injectable()
export class PrismaRutaRepository implements RutaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(ruta: Ruta, progreso: Progreso): Promise<Ruta> {
    await this.prisma.$transaction(async (tx) => {
      await tx.ruta.create({
        data: {
          id: ruta.id,
          nombre: ruta.nombre,
          descripcion: ruta.descripcion,
          usuarioId: ruta.usuarioId,
        },
      });

      await tx.progreso.create({
        data: {
          id: progreso.id,
          rutaId: progreso.rutaId,
          estado: progreso.estado,
          porcentaje: progreso.porcentaje,
          creadoEn: progreso.creadoEn,
          actualizadoEn: progreso.actualizadoEn,
        },
      });
    });

    return ruta;

    /*const nuevaRuta = await this.prisma.ruta.create({
      data: {
        id: ruta.id,
        nombre: ruta.nombre,
        descripcion: ruta.descripcion,
        usuarioId: ruta.usuarioId,
      },
    });
    return this.mapear(nuevaRuta);*/
  }

  async listar(
    nombre: string | undefined,
    usuarioId: string | undefined,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Ruta & { usuario: string }>> {
    // Creamos un objeto where para filtrar las rutas por usuarioId
    const where: Prisma.RutaWhereInput = {};

    if (nombre) {
      where.nombre = {
        contains: nombre,
        mode: 'insensitive',
      };
    }

    if (usuarioId !== undefined) {
      where.usuarioId = usuarioId;
    }

    return this.listaPaginada(where, pagina, limite);
  }

  async obtenerPorId(id: string): Promise<(Ruta & { usuario: string }) | null> {
    const ruta = await this.prisma.ruta.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (!ruta) {
      return null;
    }

    return {
      ...this.mapear(ruta),
      usuario: ruta.usuario.nombre,
    };
  }

  async actualizar(ruta: Ruta): Promise<Ruta> {
    const rutaActualizada = await this.prisma.ruta.update({
      where: { id: ruta.id },
      data: {
        nombre: ruta.nombre,
        descripcion: ruta.descripcion,
      },
    });

    return this.mapear(rutaActualizada);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.ruta.delete({
      where: { id },
    });
  }

  // Método privado para mapear la entidad de Prisma a la entidad de dominio
  private mapear(ruta: Prisma.RutaGetPayload<null>): Ruta {
    return new Ruta(
      ruta.id,
      ruta.nombre,
      ruta.descripcion,
      ruta.usuarioId,
      ruta.creadaEn,
    );
  }

  // Método privado para listar rutas con paginación y filtrado
  private async listaPaginada(
    where: Prisma.RutaWhereInput,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Ruta & { usuario: string }>> {
    const skip = (pagina - 1) * limite;

    const [rutas, total] = await Promise.all([
      this.prisma.ruta.findMany({
        where,
        skip,
        take: limite,
        orderBy: {
          creadaEn: 'desc',
        },
        include: {
          usuario: {
            select: {
              nombre: true,
            },
          },
        },
      }),
      this.prisma.ruta.count({ where }),
    ]);
    return {
      datos: rutas.map((ruta) => ({
        ...this.mapear(ruta),
        usuario: ruta.usuario.nombre,
      })),
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }
}
