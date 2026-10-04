import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginacionDto } from '../../common/dto/paginacion.dto';

export class ListarUsuariosDto extends PaginacionDto {
  // Buscar por nombre o email
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  nombre?: string;

  // Filtrar usuarios por estado
  @IsOptional()
  // Transformar el valor a booleano si es una cadena 'true' o 'false'
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'El estado activo debe ser true o false' })
  activo?: boolean;
}
