import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CrearEtapaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la etapa es obligatorio' })
  @MaxLength(100, {
    message: 'El nombre de la etapa no puede exceder los 100 caracteres',
  })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MaxLength(500, {
    message: 'La descripción no puede tener más de 500 caracteres',
  })
  descripcion: string;

  @IsString()
  @IsNotEmpty({ message: 'La ruta es obligatoria' })
  @IsUUID('4', { message: 'El rutaId debe ser un UUID válido' })
  rutaId: string;
}
