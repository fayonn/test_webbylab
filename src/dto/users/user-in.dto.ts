import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { TrimString } from '../../utils/validator.utils';

export class UserInDto {
  @IsEmail()
  @TrimString()
  @IsNotEmpty()
  @Expose()
  email: string;

  @IsString()
  @TrimString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  confirmPassword: string;
}
