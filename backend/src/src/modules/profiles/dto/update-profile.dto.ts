import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

function nullToUndefined({ value }: { value: any }) {
  return value === null || value === '' ? undefined : value;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @Transform(nullToUndefined)
  first_name?: string;

  @IsString()
  @IsOptional()
  @Transform(nullToUndefined)
  last_name?: string;

  @IsString()
  @IsOptional()
  @Transform(nullToUndefined)
  gender?: string;

  @IsString()
  @IsOptional()
  @Transform(nullToUndefined)
  birth_date?: string;

  @IsString()
  @IsOptional()
  @Transform(nullToUndefined)
  city?: string;

  @IsString()
  @IsOptional()
  @Transform(nullToUndefined)
  marital_status?: string;

  @IsString()
  @IsOptional()
  @Transform(nullToUndefined)
  education_level?: string;

  @IsString()
  @IsOptional()
  @Transform(nullToUndefined)
  education?: string;

  @IsString()
  @IsOptional()
  @Transform(nullToUndefined)
  bio?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(nullToUndefined)
  is_public?: boolean;

  /**
   * age=null یا age='' → undefined تا @IsInt() رد نشه
   */
  @IsInt()
  @Min(18)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    const n = Number(value);
    return isNaN(n) ? undefined : n;
  })
  @Type(() => Number)
  age?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.filter((v: any) => typeof v === 'string' && v.trim());
    return undefined;
  })
  interests?: string[];
}
