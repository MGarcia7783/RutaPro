import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CrearTareaDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(100, { message: 'El título no puede superar los 100 caracteres' })
  titulo: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'La descripción no puede superar los 500 caracteres',
  })
  descripcion?: string;

  @IsNotEmpty({ message: 'La etapa es obligatorio' })
  @IsUUID('4', { message: 'La etapa debe ser un UUID válido' })
  etapaId: string;
}
