import { IsEmail, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @Length(1, 64)
  password: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
