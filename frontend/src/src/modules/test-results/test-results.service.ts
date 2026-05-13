import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestResult } from './entities/test-result.entity';
import { CreateTestResultDto } from './dto/create-test-result.dto';

@Injectable()
export class TestResultsService {
  constructor(
    @InjectRepository(TestResult)
    private testResultsRepository: Repository<TestResult>,
  ) {}

  async create(
    userId: string,
    createTestResultDto: CreateTestResultDto,
  ): Promise<TestResult> {
    const testResult = this.testResultsRepository.create({
      user_id: userId,
      ...createTestResultDto,
      completed_at: new Date(),
    });

    return await this.testResultsRepository.save(testResult);
  }

  async findByUserId(userId: string): Promise<TestResult[]> {
    return await this.testResultsRepository.find({
      where: { user_id: userId },
      order: { completed_at: 'DESC' },
    });
  }
}
