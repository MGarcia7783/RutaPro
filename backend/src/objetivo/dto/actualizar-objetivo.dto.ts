import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class ActualizarObjetivoDto {
  // Título opcional
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El título no puede tener más de 100 caracteres' })
  titulo?: string;

  // Descripción opcional
  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'La descripción no puede tener más de 500 caracteres',
  })
  descripcion?: string;

  // Completado opcional
  @IsOptional()
  @IsBoolean({ message: 'El campo completado debe ser verdadero o falso' })
  completado?: boolean;
}
