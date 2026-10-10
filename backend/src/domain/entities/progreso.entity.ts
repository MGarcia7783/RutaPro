import { EstadoProgreso } from '../enums/estado-progreso.enum';

export class Progreso {
  id: string;
  rutaId: string;
  estado: EstadoProgreso;
  porcentaje: number;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(
    id: string,
    rutaId: string,
    estado: EstadoProgreso,
    porcentaje: number,
    creadoEn: Date,
    actualizadoEn: Date,
  ) {
    this.id = id;
    this.rutaId = rutaId;
    this.estado = estado;
    this.porcentaje = porcentaje;
    this.creadoEn = creadoEn;
    this.actualizadoEn = actualizadoEn;
  }
}
