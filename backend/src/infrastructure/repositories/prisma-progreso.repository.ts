import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { ProgresoRepository } from '../../domain/repositories/progreso.repository';
import { Progreso } from '../../domain/entities/progreso.entity';
import { Prisma } from '../../generated/prisma/client';
import { EstadoProgreso } from '../../domain/enums/estado-progreso.enum';

@Injectable()
export class PrismaProgresoRepository implements ProgresoRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Implementación del método crear
  async crear(progreso: Progreso): Promise<Progreso> {
    const nuevoProgreso = await this.prisma.progreso.create({
      data: {
        id: progreso.id,
        rutaId: progreso.rutaId,
        estado: progreso.estado,
        porcentaje: progreso.porcentaje,
        creadoEn: progreso.creadoEn,
        actualizadoEn: progreso.actualizadoEn,
      },
    });

    return this.mapear(nuevoProgreso);
  }

  // 2. Implementación del método obtenerPorRutaId
  async obtenerPorRutaId(rutaId: string): Promise<Progreso | null> {
    const progreso = await this.prisma.progreso.findUnique({
      where: {
        rutaId,
      },
    });

    return progreso ? this.mapear(progreso) : null;
  }

  // 3. Implementación del método actualizar
  async actualizar(progreso: Progreso): Promise<Progreso> {
    const progresoActualizado = await this.prisma.progreso.update({
      where: {
        id: progreso.id,
      },
      data: {
        estado: progreso.estado,
        porcentaje: progreso.porcentaje,
      },
    });

    return this.mapear(progresoActualizado);
  }

  // Método privado para mapear el resultado de Prisma a la entidad Progreso
  private mapear(progreso: Prisma.ProgresoGetPayload<null>): Progreso {
    return new Progreso(
      progreso.id,
      progreso.rutaId,
      progreso.estado as EstadoProgreso,
      progreso.porcentaje,
      progreso.creadoEn,
      progreso.actualizadoEn,
    );
  }
}
