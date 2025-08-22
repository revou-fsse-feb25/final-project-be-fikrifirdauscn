import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateBookingDto {
  @IsUUID('4', { message: 'ID event tidak valid' })
  @IsNotEmpty({ message: 'ID event tidak boleh kosong' })
  eventId: string;

  @IsNumber({}, { message: 'Jumlah tiket harus berupa angka' })
  @Min(1, { message: 'Jumlah tiket minimal 1' })
  @IsNotEmpty({ message: 'Jumlah tiket tidak boleh kosong' })
  numberOfTickets: number;
}