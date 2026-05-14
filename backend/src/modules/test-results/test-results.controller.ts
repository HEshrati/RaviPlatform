import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { TestResultsService } from "./test-results.service";
import { CreateTestResultDto } from "./dto/create-test-result.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("test-results")
@UseGuards(JwtAuthGuard)
export class TestResultsController {
  constructor(private testResultsService: TestResultsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Body() createTestResultDto: CreateTestResultDto,
  ) {
    return await this.testResultsService.create(
      req.user.id,
      createTestResultDto,
    );
  }

  @Get("my")
  async getMyTestResults(@Request() req) {
    const results = await this.testResultsService.findByUserId(req.user.id);
    return {
      data: results.map((result) => ({
        id: result.id,
        test_name: result.test_name,
        main_result: result.main_result,
        completed_at: result.completed_at,
        scores: result.scores,
      })),
    };
  }

  // ── Admin: دریافت نتیجه تست یک کاربر خاص ──────────────────
  @Get("user/:userId")
  async getUserTestResults(@Param("userId") userId: string) {
    const results = await this.testResultsService.findByUserId(userId);
    return {
      data: results.map((result) => ({
        id: result.id,
        test_name: result.test_name,
        main_result: result.main_result,
        completed_at: result.completed_at,
        scores: result.scores,
      })),
    };
  }
}
