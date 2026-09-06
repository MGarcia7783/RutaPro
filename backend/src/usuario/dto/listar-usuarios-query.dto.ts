import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class ListarUsuariosQueryDto {
  // Número de página a consutar
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El valor de la página debe ser un número entero' })
  @Min(1, { message: 'El valor de la página debe ser mayor o igual a 1' })
  pagina: number = 1;

  // Cantidad de usuarios por página
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite por página debe ser un número entero' })
  @Min(1, { message: 'El límite por página debe ser mayor o igual a 1' })
  limite: number = 10;

  // Buscar por nombre o email
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  @MinLength(2, { message: 'La búsqueda debe tener al menos 2 caracteres' })
  buscar?: string;

  // Filtrar usuarios por estado
  @IsOptional()
  @IsBooleanString({ message: 'El estado activo debe ser true o false' })
  activo?: string;

  // Filtrar usuarios por rol
  @IsOptional()
  @IsString({ message: 'El rolId debe ser una cadena de texto' })
  rolId?: string;

  // Campo utilizado para ordenar los resultados
  @IsOptional()
  @IsIn(['nombre', 'email', 'creadoEn'], {
    message:
      'El campo de ordenamiento debe ser uno de los siguientes: nombre, email, creadoEn',
  })
  ordenarPor: string = 'creadoEn';

  // Dirección de ordenamiento
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'La dirección de ordenamiento debe ser asc o desc',
  })
  orden: 'asc' | 'desc' = 'desc';
}
