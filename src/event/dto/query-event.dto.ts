import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryEventDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
