import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  @MaxLength(20, { message: 'Password maksimal 20 karakter' })
  password: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong jika disediakan' })
  name?: string;
}