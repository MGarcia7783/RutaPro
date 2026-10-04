import { Etapa } from '../entities/etapa.entity';
import { ResultadoPaginado } from '../common/resultado-paginado';

export interface EtapaRepository {
  crear(etapa: Etapa): Promise<Etapa>;

  obtenerSiguienteOrden(rutaId: string): Promise<number>;

  listar(
    usuarioId: string | undefined,
    nombre: string | undefined,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<Etapa>>;

  obtenerPorIdConRuta(id: string): Promise<{
    etapa: Etapa;
    usuarioId: string;
  } | null>;

  actualizar(etapa: Etapa): Promise<Etapa>;

  eliminar(id: string): Promise<void>;
}
