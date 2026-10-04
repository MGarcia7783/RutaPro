import { IsOptional, IsString } from 'class-validator';
import { PaginacionDto } from '../../common/dto/paginacion.dto';

export class ListarEtapasDto extends PaginacionDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;
}
