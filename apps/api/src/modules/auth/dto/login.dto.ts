import { IsEmail, IsString } from 'class-validator';
import { MaxBytes } from './max-bytes.decorator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MaxBytes(72)
  password!: string;
}
