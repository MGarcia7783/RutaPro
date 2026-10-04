export class Usuario {
  id: string;
  nombre: string;
  email: string;
  passwordHash: string;
  rolId: string;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(
    id: string,
    nombre: string,
    email: string,
    passwordHash: string,
    rolId: string,
    creadoEn: Date,
    actualizadoEn: Date,
    activo: boolean = true,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.passwordHash = passwordHash;
    this.rolId = rolId;
    this.creadoEn = creadoEn;
    this.actualizadoEn = actualizadoEn;
    this.activo = activo;
  }
}
