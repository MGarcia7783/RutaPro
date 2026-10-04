import { IsOptional, IsString } from 'class-validator';
import { PaginacionDto } from '../../common/dto/paginacion.dto';

export class ListarTareasDto extends PaginacionDto {
  // Buscar por título
  @IsOptional()
  @IsString({
    message: 'El título de la búsqueda debe ser una cadena de texto',
  })
  titulo?: string;
}
