import { Injectable } from '@nestjs/common';
import { ResultadoPaginado } from '../../domain/common/resultado-paginado';
import { Etapa } from '../../domain/entities/etapa.entity';
import { EtapaRepository } from '../../domain/repositories/etapa.repository';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class PrismaEtapaRepository implements EtapaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Método para crear una nueva etapa de aprendizaje
  async crear(etapa: Etapa): Promise<Etapa> {
    const nuevaEtapa = await this.prisma.etapa.create({
      data: {
        id: etapa.id,
        nombre: etapa.nombre,
        descripcion: etapa.descripcion,
        orden: etapa.orden,
        rutaId: etapa.rutaId,
      },
    });
    return this.mapear(nuevaEtapa);
  }

  // 2. Método para obtener el siguiente orden de una etapa
  // de aprendizaje dentro de una ruta específica
  async obtenerSiguienteOrden(rutaId: string): Promise<number> {
    const ultimaEtapa = await this.prisma.etapa.findFirst({
      where: {
        rutaId,
      },
      orderBy: {
        orden: 'desc',
      },
    });

    if (!ultimaEtapa) {
      return 1;
    }

    return ultimaEtapa.orden + 1;
  }

  // 3. Método para listar las etapas de aprendizaje con paginación
  async listar(
    usuarioId: string | undefined,
    nombre: string | undefined,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Etapa>> {
    const where: Prisma.EtapaWhereInput = {};

    if (usuarioId !== undefined) {
      where.ruta = {
        usuarioId: usuarioId,
      };
    }

    if (nombre !== undefined) {
      where.nombre = {
        contains: nombre,
        mode: 'insensitive',
      };
    }
    return this.listaPaginada(where, pagina, limite);
  }

  // 4. Método para obtener una etapa de aprendizaje por su ID
  // junto con el ID del usuario propietario de la ruta
  async obtenerPorIdConRuta(
    id: string,
  ): Promise<{ etapa: Etapa; usuarioId: string } | null> {
    const resultado = await this.prisma.etapa.findUnique({
      where: { id },
      include: {
        ruta: {
          select: {
            usuarioId: true,
          },
        },
      },
    });

    return resultado
      ? { etapa: this.mapear(resultado), usuarioId: resultado.ruta.usuarioId }
      : null;
  }

  // 5. Método para actualizar una etapa de aprendizaje existente
  async actualizar(etapa: Etapa): Promise<Etapa> {
    const etapaActualizada = await this.prisma.etapa.update({
      where: {
        id: etapa.id,
      },
      data: {
        nombre: etapa.nombre,
        descripcion: etapa.descripcion,
      },
    });

    return this.mapear(etapaActualizada);
  }

  // 6. Método para eliminar una etapa de aprendizaje por su ID
  async eliminar(id: string): Promise<void> {
    await this.prisma.etapa.delete({
      where: { id },
    });
  }

  // Método privado para mapear la entidad Prisma a la entidad de dominio
  private mapear(etapa: Prisma.EtapaGetPayload<null>): Etapa {
    return new Etapa(
      etapa.id,
      etapa.nombre,
      etapa.descripcion,
      etapa.orden,
      etapa.rutaId,
    );
  }

  // Método privado para obtener una lista paginada de etapas
  private async listaPaginada(
    where: Prisma.EtapaWhereInput,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Etapa>> {
    const skip = (pagina - 1) * limite;

    const [etapas, total] = await Promise.all([
      this.prisma.etapa.findMany({
        where,
        skip,
        take: limite,
        orderBy: {
          orden: 'asc',
        },
      }),
      this.prisma.etapa.count({ where }),
    ]);
    return {
      datos: etapas.map((etapa) => this.mapear(etapa)),
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }
}
