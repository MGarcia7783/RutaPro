import { Inject } from '@nestjs/common';
import { RUTA_REPOSITORY } from '../common/ruta-repository.token';
import type { RutaRepository } from '../../domain/repositories/ruta.repository';
import { Ruta } from '../../domain/entities/ruta.entity';
import { PrismaErrorHelper } from '../../infrastructure/error/prisma-error.helper';
import { Progreso } from '../../domain/entities/progreso.entity';
import { EstadoProgreso } from '../../domain/enums/estado-progreso.enum';

export class CrearRutaUseCase {
  constructor(
    @Inject(RUTA_REPOSITORY)
    private readonly rutaRepository: RutaRepository,
  ) {}

  async ejecutar(
    nombre: string,
    descripcion: string,
    usuarioId: string,
  ): Promise<Ruta> {
    try {
      const ruta = new Ruta(
        crypto.randomUUID(),
        nombre,
        descripcion,
        usuarioId,
        new Date(),
      );

      const progreso = this.crearProgreso(ruta.id);

      // Guardar la nueva ruta
      return await this.rutaRepository.crear(ruta, progreso);
    } catch (error) {
      PrismaErrorHelper.manejar(error);
    }
  }

  private crearProgreso(rutaId: string): Progreso {
    const progreso = new Progreso(
      crypto.randomUUID(),
      rutaId,
      EstadoProgreso.SIN_INICIAR,
      0,
      new Date(),
      new Date(),
    );
    return progreso;
  }
}
