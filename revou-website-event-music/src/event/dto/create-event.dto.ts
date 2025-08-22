import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsDateString,
  IsOptional,
  IsUrl,
  MaxLength,
  IsUUID
} from 'class-validator';

export class CreateEventDto {
  @IsString({ message: 'Nama event harus berupa string' })
  @IsNotEmpty({ message: 'Nama event tidak boleh kosong' })
  @MaxLength(100, { message: 'Nama event maksimal 100 karakter' })
  name: string;

  @IsString({ message: 'Deskripsi event harus berupa string' })
  @IsOptional()
  description?: string;

  @IsDateString({}, { message: 'Tanggal dan waktu event tidak valid' })
  @IsNotEmpty({ message: 'Tanggal dan waktu event tidak boleh kosong' })
  date: string; 

  @IsString({ message: 'Lokasi event harus berupa string' })
  @IsNotEmpty({ message: 'Lokasi event tidak boleh kosong' })
  location: string;

  @IsString({ message: 'Artis event harus berupa string' })
  @IsNotEmpty({ message: 'Artis event tidak boleh kosong' })
  artist: string;

  @IsNumber({}, { message: 'Harga tiket harus berupa angka' })
  @Min(0, { message: 'Harga tiket tidak boleh negatif' })
  @IsNotEmpty({ message: 'Harga tiket tidak boleh kosong' })
  price: number;

  @IsNumber({}, { message: 'Total tiket harus berupa angka' })
  @Min(1, { message: 'Total tiket minimal 1' })
  @IsNotEmpty({ message: 'Total tiket tidak boleh kosong' })
  totalTickets: number;

  @IsUrl({}, { message: 'URL gambar tidak valid' })
  @IsOptional()
  imageUrl?: string;

  @IsUUID('4', { message: 'ID kategori tidak valid' })
  @IsOptional() 
  categoryId?: string;
}