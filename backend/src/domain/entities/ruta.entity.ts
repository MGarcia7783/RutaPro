export class Ruta {
  id: string;
  nombre: string;
  descripcion: string;
  usuarioId: string;
  creadaEn: Date;

  constructor(
    id: string,
    nombre: string,
    descripcion: string,
    usuarioId: string,
    creadaEn: Date,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.usuarioId = usuarioId;
    this.creadaEn = creadaEn;
  }
}
