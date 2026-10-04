import { Rol } from '../entities/rol.entity';

export interface RolRepository {
  buscarPorNombre(nombre: string): Promise<Rol | null>;
}
