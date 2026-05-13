import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestResultsService } from './test-results.service';
import { TestResultsController } from './test-results.controller';
import { TestResult } from './entities/test-result.entity';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestResult, SmartProfile])],
  controllers: [TestResultsController],
  providers: [TestResultsService],
  exports: [TestResultsService],
})
export class TestResultsModule {}
