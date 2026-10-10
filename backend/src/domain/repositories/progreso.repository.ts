import { Progreso } from '../entities/progreso.entity';

export interface ProgresoRepository {
  crear(progreso: Progreso): Promise<Progreso>;

  obtenerPorRutaId(rutaId: string): Promise<Progreso | null>;

  actualizar(progreso: Progreso): Promise<Progreso>;
}
