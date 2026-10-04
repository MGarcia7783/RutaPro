import { RefreshToken } from '../entities/refresh-token.entity';

export interface RefreshTokenRepository {
  crear(refreshToken: RefreshToken): Promise<void>;

  eliminarExpirados(usuarioId: string): Promise<void>;

  buscarVigentes(usuarioId: string): Promise<RefreshToken[]>;

  eliminar(id: string): Promise<void>;
}
