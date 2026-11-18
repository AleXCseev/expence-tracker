import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { MaxBytes } from './max-bytes.decorator';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxBytes(72)
  password!: string;
}
