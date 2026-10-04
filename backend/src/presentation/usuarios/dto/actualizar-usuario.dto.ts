import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class ActualizarUsuarioDto {
  @IsOptional()
  @IsUUID('4', { message: 'El rol debe ser un UUID válido' })
  rolId?: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser verdadero o falso' })
  activo?: boolean;
}
