import { Usuario } from '../../../domain/entities/usuario.entity';

export class UsuarioResponseDto {
  id: string;
  nombre: string;
  email: string;
  rolId: string;
  rol?: string;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;

  // Constructor que recibe una instancia de Usuario
  // y asigna sus propiedades al DTO
  constructor(usuario: Usuario, rol?: string) {
    this.id = usuario.id;
    this.nombre = usuario.nombre;
    this.email = usuario.email;
    this.rolId = usuario.rolId;
    this.rol = rol;
    this.activo = usuario.activo;
    this.creadoEn = usuario.creadoEn;
    this.actualizadoEn = usuario.actualizadoEn;
  }
}
