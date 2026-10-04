import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginacionDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'La página debe ser un número entero',
  })
  @Min(1, {
    message: 'La página debe ser mayor o igual a 1',
  })
  pagina: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'El límite debe ser un número entero',
  })
  @Min(1, {
    message: 'El límite debe ser mayor o igual a 1',
  })
  limite: number = 10;
}
