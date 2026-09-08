import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ActualizarEtapaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la etapa es obligatorio' })
  @MaxLength(100, {
    message: 'El nombre de la etapa no puede exceder los 100 caracteres',
  })
  nombre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MaxLength(500, {
    message: 'La descripción no puede tener más de 500 caracteres',
  })
  descripcion?: string;
}
