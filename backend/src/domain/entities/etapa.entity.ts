export class Etapa {
  id: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  rutaId: string;

  constructor(
    id: string,
    nombre: string,
    descripcion: string | null,
    orden: number,
    rutaId: string,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.orden = orden;
    this.rutaId = rutaId;
  }
}
