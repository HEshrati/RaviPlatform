import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class BookSessionDto {
  @IsUUID()
  therapistId: string;

  @IsOptional()
  @IsString()
  slotDate?: string;

  @IsOptional()
  @IsString()
  slotTime?: string;

  @IsIn(['online', 'in_person'])
  mode: 'online' | 'in_person';
}

export class JoinGroupDto {
  // Body-less; group_id is in URL params
}
