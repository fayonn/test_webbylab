import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';
import { Expose } from 'class-transformer';
import { MovieFormat } from '../../entities/movie.entity';
import { TrimString, TrimStringArray } from '../../utils/validator.utils';

export class MovieInDto {
  @TrimString()
  @IsString()
  @IsNotEmpty()
  @Expose()
  title: string;

  @IsInt()
  @Min(1888)
  @IsNotEmpty()
  @Expose()
  year: number;

  @IsEnum(MovieFormat)
  @IsNotEmpty()
  @Expose()
  format: MovieFormat;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @Expose()
  @TrimStringArray()
  @Matches(/^[a-zA-Zа-яА-ЯҐЄІЇєіїґ,\-\s]+$/, {
    message: "The actor name must consist of letters, ',', '-', ' '",
    each: true
  })
  actors: string[];
}
