import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CrearEtapaDto {
  // Nombre de la etapa de aprendizaje
  @IsString({ message: 'El nombre de la etapa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la etapa es obligatorio' })
  @MinLength(3, {
    message: 'El nombre de la etapa debe tener al menos 3 caracteres',
  })
  nombre: string;

  // Descripción de la etapa de aprendizaje
  @IsOptional()
  @IsString({
    message: 'La descripción de la etapa debe ser una cadena de texto',
  })
  @MinLength(10, {
    message: 'La descripción de la etapa debe tener al menos 10 caracteres',
  })
  descripcion?: string;

  // ID de la ruta a la que pertenece la etapa de aprendizaje
  @IsNotEmpty({ message: 'La ruta de aprendizaje es obligatorio' })
  @IsUUID('4', { message: 'La ruta de aprendizaje debe ser un UUID válido' })
  rutaId: string;
}
