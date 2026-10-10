import { ResultadoPaginado } from '../common/resultado-paginado';
import { Tarea } from '../entities/tarea.entity';

export interface TareaRepository {
  crear(tarea: Tarea): Promise<Tarea>;

  // Verificar si un usuario tiene acceso a una etapa específica
  tieneAccesoEtapa(etapaId: string, usuarioId: string): Promise<boolean>;

  listar(
    titulo: string | undefined,
    usuarioId: string | undefined,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Tarea & { usuario: string }>>;

  obtenerPorIdConRuta(
    id: string,
  ): Promise<{ tarea: Tarea; usuarioId: string; usuario: string } | null>;

  obtenerResumenPorRuta(
    rutaid: string,
  ): Promise<{ total: number; completadas: number }>;

  obtenerRutaIdPorEtapa(etapaId: string): Promise<string | null>;

  actualizar(tarea: Tarea): Promise<Tarea>;

  eliminar(id: string): Promise<void>;
}
