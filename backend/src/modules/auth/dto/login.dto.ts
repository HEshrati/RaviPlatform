import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; // ایمیل یا شماره موبایل

  @IsString()
  @IsNotEmpty()
  password: string;
}
