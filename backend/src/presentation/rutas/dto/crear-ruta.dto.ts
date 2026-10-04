import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CrearRutaDto {
  // Nombre de la ruta de aprendizaje
  @IsString({ message: 'El nombre de la ruta debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la ruta es obligatorio' })
  @MinLength(3, {
    message: 'El nombre de la ruta debe tener al menos 3 caracteres',
  })
  nombre: string;

  // Descripción de la ruta de aprendizaje
  @IsString({
    message: 'La descripción de la ruta debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'La descripción de la ruta es obligatoria' })
  @MinLength(10, {
    message: 'La descripción de la ruta debe tener al menos 10 caracteres',
  })
  descripcion: string;
}
