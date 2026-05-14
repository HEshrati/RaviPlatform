import { IsString, IsObject } from 'class-validator';

export class CreateTestResultDto {
  @IsString()
  test_name: string;

  @IsString()
  main_result: string;

  @IsObject()
  scores: any;
}
