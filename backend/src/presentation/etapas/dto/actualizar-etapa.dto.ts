import { IsOptional, IsString, MinLength } from 'class-validator';

export class ActualizarEtapaDto {
  @IsOptional()
  @IsString({ message: 'El nombre de la etapa debe ser una cadena de texto' })
  @MinLength(3, {
    message: 'El nombre de la etapa debe tener al menos 3 caracteres',
  })
  nombre?: string;

  @IsOptional()
  @IsString({
    message: 'La descripción de la etapa debe ser una cadena de texto',
  })
  @MinLength(10, {
    message: 'La descripción de la etapa debe tener al menos 10 caracteres',
  })
  descripcion?: string;
}
