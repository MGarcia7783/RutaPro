import { Ruta } from '../entities/ruta.entity';

export abstract class RutaRepository {
  abstract crear(ruta: Ruta): Promise<Ruta>;
  abstract buscarPorId(id: string): Promise<Ruta | null>;
  abstract listar(): Promise<Ruta[]>;
}
