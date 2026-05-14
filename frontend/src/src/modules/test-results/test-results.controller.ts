import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { CreateTestResultDto } from './dto/create-test-result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/test-results')
@UseGuards(JwtAuthGuard)
export class TestResultsController {
  constructor(private testResultsService: TestResultsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createTestResultDto: CreateTestResultDto) {
    return await this.testResultsService.create(req.user.id, createTestResultDto);
  }

  @Get('my')
  async getMyTestResults(@Request() req) {
    const results = await this.testResultsService.findByUserId(req.user.id);

    return {
      data: results.map((result) => ({
        id: result.id,
        test_name: result.test_name,
        main_result: result.main_result,
        scores: result.scores,
        completed_at: result.completed_at,
      })),
    };
  }
}
