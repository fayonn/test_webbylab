import { IsArray, IsInt, IsNotEmpty, IsObject, Min, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { MovieOutDto } from './movie-out.dto';

class MetaDto {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Expose()
  imported: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Expose()
  total: number;
}

export class MovieImportOutDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MovieOutDto)
  @Expose()
  data: Omit<MovieOutDto, 'actors'>[];

  @ValidateNested()
  @Type(() => MetaDto)
  @IsNotEmpty()
  @IsObject()
  @Expose()
  meta: MetaDto;
}
