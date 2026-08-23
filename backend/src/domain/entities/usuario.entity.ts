export class Usuario {
  constructor(
    public readonly id: string,
    public nombre: string,
    public readonly email: string,
    public readonly passwordHash: string | null,
    public readonly googleId: string | null,
    public readonly rolId: string,
    public readonly creadoEn: Date,
    public readonly actualizadoEn: Date,
  ) {}
}
