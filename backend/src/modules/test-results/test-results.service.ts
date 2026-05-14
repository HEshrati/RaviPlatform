import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestResult } from './entities/test-result.entity';
import { CreateTestResultDto } from './dto/create-test-result.dto';
import { SmartProfile, CommunicationType } from '../smart-profile/entities/smart-profile.entity';

@Injectable()
export class TestResultsService {
  private readonly logger = new Logger(TestResultsService.name);

  constructor(
    @InjectRepository(TestResult)
    private testResultsRepository: Repository<TestResult>,
    @InjectRepository(SmartProfile)
    private smartProfileRepo: Repository<SmartProfile>,
  ) {}

  async create(userId: string, createTestResultDto: CreateTestResultDto): Promise<TestResult> {
    const testResult = this.testResultsRepository.create({
      user_id: userId,
      ...createTestResultDto,
      completed_at: new Date(),
    });

    const saved = await this.testResultsRepository.save(testResult);

    // ── پس از ذخیره تست، داده‌ها را به smart_profiles منتقل کن ──
    if (createTestResultDto.test_name === 'onboarding_personality') {
      await this.syncToSmartProfile(userId, createTestResultDto.scores);
    }

    return saved;
  }

  /**
   * نگاشت پاسخ‌های تست به فیلدهای smart_profile
   *
   * سوال ۴  → extroversion_score  (1=درون‌گرا … 5=برون‌گرا  → 0-100)
   * سوال ۵  → energy_level        (1=نیاز به جرقه … 5=خودانگیخته → 0-100)
   * سوال ۶  → (satisfaction — فعلاً در test_results نگه می‌داریم)
   * سوالات ۱-۳ → communication_type استنتاج می‌شود
   */
  private async syncToSmartProfile(userId: string, scores: Record<string, any>): Promise<void> {
    try {
      let sp = await this.smartProfileRepo.findOne({ where: { user_id: userId } });
      if (!sp) {
        sp = this.smartProfileRepo.create({ user_id: userId });
      }

      // سوال ۴: درون‌گرا/برون‌گرا — تبدیل مقیاس ۱-۵ به ۰-۱۰۰
      if (scores[4] !== undefined) {
        sp.extroversion_score = ((Number(scores[4]) - 1) / 4) * 100;
      }

      // سوال ۵: سطح انرژی و انگیزه — تبدیل مقیاس ۱-۵ به ۰-۱۰۰
      if (scores[5] !== undefined) {
        sp.energy_level = ((Number(scores[5]) - 1) / 4) * 100;
      }

      // تعیین communication_type از extroversion_score
      if (sp.extroversion_score >= 65) {
        sp.communication_type = CommunicationType.EXTROVERT;
      } else if (sp.extroversion_score <= 35) {
        sp.communication_type = CommunicationType.INTROVERT;
      } else {
        sp.communication_type = CommunicationType.AMBIVERT;
      }

      // ذخیره خلاصه نتایج تست برای مراجعه بعدی
      sp.test_results_summary = { ...sp.test_results_summary, onboarding: scores };
      sp.last_ai_update = new Date();

      await this.smartProfileRepo.save(sp);
      this.logger.log(
        `SmartProfile synced for user ${userId}: extroversion=${sp.extroversion_score}, energy=${sp.energy_level}, type=${sp.communication_type}`,
      );
    } catch (e) {
      this.logger.error(`Failed to sync smart profile for user ${userId}: ${e.message}`);
    }
  }

  async findByUserId(userId: string): Promise<TestResult[]> {
    return await this.testResultsRepository.find({
      where: { user_id: userId },
      order: { completed_at: 'DESC' },
    });
  }
}
