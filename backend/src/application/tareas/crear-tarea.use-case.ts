import { ForbiddenException, Inject } from '@nestjs/common';
import { Tarea } from '../../domain/entities/tarea.entity';
import type { TareaRepository } from '../../domain/repositories/tarea.repository';
import { TAREA_REPOSITORY } from '../common/tarea-repository.token';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';
import { PROGRESO_REPOSITORY } from '../common/progreso-repository.token';
import type { ProgresoRepository } from '../../domain/repositories/progreso.repository';
import { EstadoProgreso } from '../../domain/enums/estado-progreso.enum';

export class CrearTareaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,

    @Inject(PROGRESO_REPOSITORY)
    private readonly progresoRepository: ProgresoRepository,
  ) {}

  async ejecutar(
    titulo: string,
    descripcion: string | null,
    etapaId: string,
    usuarioId: string,
    rol: string,
  ): Promise<Tarea> {
    try {
      if (rol !== 'Administrador') {
        const tieneAcceso = await this.tareaRepository.tieneAccesoEtapa(
          etapaId,
          usuarioId,
        );

        if (!tieneAcceso) {
          throw new ForbiddenException(
            'No tienes permiso para crear una tarea en esta etapa',
          );
        }
      }

      const tarea = new Tarea(
        crypto.randomUUID(),
        titulo,
        descripcion,
        etapaId,
        new Date(),
        new Date(),
      );
      const tareaCreada = await this.tareaRepository.crear(tarea);

      const rutaId = await this.tareaRepository.obtenerRutaIdPorEtapa(etapaId);

      if (rutaId) {
        await this.actualizarProgreso(rutaId);
      }

      return tareaCreada;

      //return await this.tareaRepository.crear(tarea);
    } catch (error) {
      if (error instanceof ForbiddenException) {
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
