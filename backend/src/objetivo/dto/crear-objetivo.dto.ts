import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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
}
