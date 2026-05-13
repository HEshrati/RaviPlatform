import {
  IsString, IsNumber, IsDateString, IsBoolean, IsOptional, Min, IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  event_type?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  capacity: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  price?: number;

  // Support both snake_case and camelCase date inputs
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  location?: string; // محرمانه - فقط ۱۰ ساعت آخر

  @IsString()
  @IsOptional()
  city?: string; // عمومی

  @IsBoolean()
  @IsOptional()
  is_online?: boolean;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean; // camelCase alias از فرانت

  @IsString()
  @IsOptional()
  targetPersonalityTraits?: string;
}

