import { IsArray, IsInt, IsNotEmpty, Min, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { MovieOutDto } from './movie-out.dto';

class MetaDto {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Expose()
  total: number;
}

export class MovieListOutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => MovieOutDto)
  @Expose()
  data: MovieOutDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MetaDto)
  @Expose()
  meta: MetaDto;
}
