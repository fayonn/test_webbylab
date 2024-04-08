import { IsDateString, IsNotEmpty, IsPositive, IsString, Matches } from 'class-validator';
import { Expose } from 'class-transformer';
import { TrimString } from '../../utils/validator.utils';

export class ActorOutDto {
  @IsPositive()
  @IsNotEmpty()
  @Expose()
  id: number;

  @TrimString()
  @IsNotEmpty()
  @Expose()
  fullName: string;

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  createdAt: Date;

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  updatedAt: Date;
}
