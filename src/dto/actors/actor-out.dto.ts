import { IsDateString, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class ActorOutDto {
  @IsPositive()
  @IsNotEmpty()
  @Expose()
  id: number;

  @IsString()
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
