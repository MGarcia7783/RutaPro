import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import type { TareaRepository } from '../../domain/repositories/tarea.repository';
import { TAREA_REPOSITORY } from '../common/tarea-repository.token';
import { Tarea } from '../../domain/entities/tarea.entity';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';
import type { ProgresoRepository } from '../../domain/repositories/progreso.repository';
import { PROGRESO_REPOSITORY } from '../common/progreso-repository.token';
import { EstadoProgreso } from '../../domain/enums/estado-progreso.enum';

export class ActualizarTareaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,

    @Inject(PROGRESO_REPOSITORY)
    private readonly progresoRepository: ProgresoRepository,
  ) {}

  async ejecutar(
    id: string,
    usuarioId: string,
    rol: string,
    titulo?: string,
    descripcion?: string,
    completada?: boolean,
  ): Promise<Tarea> {
    try {
      const resultado = await this.tareaRepository.obtenerPorIdConRuta(id);

      if (!resultado) {
        throw new NotFoundException('Tarea no encontrada');
      }

      if (rol !== 'Administrador' && resultado.usuarioId !== usuarioId) {
        throw new ForbiddenException(
          'No tienes permiso para actualizar esta tarea',
        );
      }

      const tarea = resultado.tarea;

      if (titulo !== undefined) {
        tarea.titulo = titulo;
      }

      if (descripcion !== undefined) {
        tarea.descripcion = descripcion;
      }

      if (completada !== undefined) {
        tarea.completada = completada;
      }

      const tareaActualizada = await this.tareaRepository.actualizar(tarea);

      const rutaId = await this.tareaRepository.obtenerRutaIdPorEtapa(
        tarea.etapaId,
      );

      if (rutaId) {
        await this.actualizarProgreso(rutaId);
      }

      return tareaActualizada;
      //return await this.tareaRepository.actualizar(tarea);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      PrismaErrorHelper.manejar(error);
    }
  }

  private async actualizarProgreso(rutaId: string): Promise<void> {
    const progreso = await this.progresoRepository.obtenerPorRutaId(rutaId);

    if (!progreso) {
      return;
    }

    const resumen = await this.tareaRepository.obtenerResumenPorRuta(rutaId);

    let porcentaje = 0;
    let estado = EstadoProgreso.SIN_INICIAR;

    if (resumen.total > 0) {
      porcentaje = Math.round((resumen.completadas / resumen.total) * 100);

      if (resumen.completadas === resumen.total) {
        estado = EstadoProgreso.COMPLETADA;
      } else if (resumen.completadas > 0) {
        estado = EstadoProgreso.EN_PROGRESO;
      }
    }

    progreso.porcentaje = porcentaje;
    progreso.estado = estado;

    await this.progresoRepository.actualizar(progreso);
  }
}
