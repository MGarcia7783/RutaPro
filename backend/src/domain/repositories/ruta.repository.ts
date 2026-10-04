import { ResultadoPaginado } from '../common/resultado-paginado';
import { Ruta } from '../entities/ruta.entity';

export interface RutaRepository {
  guardar(ruta: Ruta): Promise<Ruta>;

  listar(
    nombre: string | undefined,
    usuarioId: string | undefined,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Ruta & { usuario: string }>>;

  obtenerPorId(id: string): Promise<(Ruta & { usuario: string }) | null>;

  actualizar(ruta: Ruta): Promise<Ruta>;

  eliminar(id: string): Promise<void>;
}
