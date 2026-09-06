import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class ListarRutasQueryDto {
  // Número de página a consutar
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El valor de la página debe ser un número entero' })
  @Min(1, { message: 'El valor de la página debe ser mayor o igual a 1' })
  pagina: number = 1;

  // Cantidad de rutas por página
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite por página debe ser un número entero' })
  @Min(1, { message: 'El límite por página debe ser mayor o igual a 1' })
  limite: number = 10;

  // Buscar por nombre de la ruta
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  @MinLength(2, { message: 'La búsqueda debe tener al menos 2 caracteres' })
  nombre?: string;

  // Campo utilizado para ordenar los resultados
  @IsOptional()
  @IsIn(['nombre', 'creadaEn'], {
    message:
      'El campo de ordenamiento debe ser uno de los siguientes: nombre, creadaEn',
  })
  ordenarPor: string = 'creadaEn';

  // Dirección de ordenamiento
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'La dirección de ordenamiento debe ser asc o desc',
  })
  orden: 'asc' | 'desc' = 'desc';
}
