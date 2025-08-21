import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Nama kategori harus berupa string' })
  @IsNotEmpty({ message: 'Nama kategori tidak boleh kosong' })
  @MaxLength(50, { message: 'Nama kategori maksimal 50 karakter' })
  name: string;
}