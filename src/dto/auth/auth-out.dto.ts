import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class AuthOutDto {
  @IsString()
  @Expose()
  @IsNotEmpty()
  token: string;
}
