import { IsOptional, IsString } from 'class-validator';
import { PaginacionDto } from '../../common/dto/paginacion.dto';

export class ListarRutasDto extends PaginacionDto {
  // Buscar por nombre
  @IsOptional()
  @IsString({
    message: 'El nombre de la búsqueda debe ser una cadena de texto',
  })
  nombre?: string;
}
