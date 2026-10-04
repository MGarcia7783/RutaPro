export class RefreshToken {
  id: string;
  tokenHash: string;
  usuarioId: string;
  expiracion: Date;
  revocado: boolean;
  creadoEn: Date;

  constructor(
    id: string,
    tokenHash: string,
    usuarioId: string,
    expiracion: Date,
    creadoEn: Date,
    revocado: boolean = false,
  ) {
    this.id = id;
    this.tokenHash = tokenHash;
    this.usuarioId = usuarioId;
    this.expiracion = expiracion;
    this.creadoEn = creadoEn;
    this.revocado = revocado;
  }
}
