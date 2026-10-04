import { ResultadoPaginado } from '../common/resultado-paginado';
import { Usuario } from '../entities/usuario.entity';

export interface UsuarioRepository {
  crear(usuario: Usuario): Promise<Usuario>;

  buscarPorEmail(email: string): Promise<Usuario | null>;

  listar(
    nombre: string | undefined,
    activo: boolean | undefined,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<{ usuario: Usuario; rol: string }>>;

  obtenerPorId(id: string): Promise<Usuario | null>;

  obtenerPorIdConRol(id: string): Promise<{
    usuario: Usuario;
    rol: string;
  } | null>;

  actualizar(usuario: Usuario): Promise<Usuario>;

  eliminar(id: string): Promise<void>;
}
