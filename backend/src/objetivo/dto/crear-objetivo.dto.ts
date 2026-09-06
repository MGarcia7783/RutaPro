import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CrearObjetivoDto {
  // Título obligatorio
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(100, { message: 'El título no puede tener más de 100 caracteres' })
  titulo: string;

  // Descripción opcional
  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'La descripción no puede tener más de 500 caracteres',
  })
  descripcion?: string;

  // Ruta de aprendizaje a la que pertenece el objetivo
  @IsNotEmpty({ message: 'La ruta de aprendizaje es obligatoria' })
  @IsUUID('4', { message: 'La rutaId debe ser un UUID válido' })
  rutaId: string;
}
