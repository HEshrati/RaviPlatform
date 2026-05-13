import {
  IsArray,
  IsEnum,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';

export class IntakeDto {
  @IsArray()
  @IsString({ each: true })
  concernTopics: string[];

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  customConcern?: string;

  @IsIn(['online', 'in_person'])
  preferredMode: 'online' | 'in_person';

  @IsArray()
  @IsString({ each: true })
  preferredTimes: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsObject()
  scaleAnswers: Record<string, number>;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsIn(['male', 'female', 'any'])
  genderPreference?: 'male' | 'female' | 'any';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
