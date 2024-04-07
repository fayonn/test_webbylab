import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { MovieFormat } from '../../entities/movie.entity';
import { ActorOutDto } from '../actors/actor-out.dto';

export class MovieOutDto {
  @IsPositive()
  @IsNotEmpty()
  @Expose()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  title: string;

  @IsPositive()
  @IsNotEmpty()
  @Expose()
  year: number;

  @IsEnum(MovieFormat)
  @IsNotEmpty()
  @Expose()
  format: MovieFormat;

  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => ActorOutDto)
  @Expose()
  actors: ActorOutDto[];

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  createdAt: Date;

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  updatedAt: Date;
}
