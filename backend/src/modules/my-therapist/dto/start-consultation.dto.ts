import { IsIn, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class StartConsultationDto {
  @IsIn(['psychologist','hamzist'])
  serviceType: 'psychologist'|'hamzist';
}

export class SelectTopicDto {
  @IsString()
  topicSlug: string;
}

export class SelectProviderDto {
  @IsUUID()
  providerId: string;
}

export class SubmitConcernsDto {
  @IsString()
  @MinLength(200, { message: 'متن دغدغه‌ها باید حداقل ۲۰۰ کاراکتر باشد' })
  concernsText: string;

  @IsOptional()
  testAnswers?: Record<string, any>;
}
