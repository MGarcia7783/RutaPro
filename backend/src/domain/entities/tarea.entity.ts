export class Tarea {
  id: string;
  titulo: string;
  descripcion: string | null;
  completada: boolean;
  etapaId: string;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(
    id: string,
    titulo: string,
    descripcion: string | null,
    etapaId: string,
    creadoEn: Date,
    actualizadoEn: Date,
    completada: boolean = false,
  ) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.etapaId = etapaId;
    this.creadoEn = creadoEn;
    this.actualizadoEn = actualizadoEn;
    this.completada = completada;
  }
}
