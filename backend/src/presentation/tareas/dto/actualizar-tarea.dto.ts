import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ActualizarTareaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  @MaxLength(100, {
    message: 'El título no puede tener más de 100 caracteres',
  })
  titulo?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @MaxLength(500, {
    message: 'La descripción no puede tener más de 500 caracteres',
  })
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  completada?: boolean;
}
