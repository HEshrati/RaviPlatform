import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  service: string;

  @IsDateString()
  @IsNotEmpty()
  bookingDate: Date;

  @IsString()
  @IsOptional()
  notes?: string;
}
