import { IsEmail, Length } from 'class-validator';

export class ChangePasswordDto {
  @Length(1, 64)
  name: string;

  @IsEmail()
  @Length(1, 64)
  email: string;

  @Length(1, 64)
  password: string;
}
