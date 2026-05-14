/**
 * Bot Module - اندپوینت‌های داخلی برای ربات تلگرام
 * ادغام با n8n و ربات تلگرام
 */

import {
  Controller, Post, Get, Body, Headers,
  UnauthorizedException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { SmartProfile } from '../smart-profile/smart-profile.entity';
import { MatchingService } from '../matching/matching.service';
import { AiContentService } from '../ai-content/ai-content.service';

const BOT_SECRET = process.env.BOT_WEBHOOK_SHARED_SECRET || 'ravi-bot-secret-2024';

function verifyBotSecret(secret: string) {
  if (secret !== BOT_SECRET) {
    throw new UnauthorizedException('دسترسی غیرمجاز');
  }
}

@Controller('api/bot')
export class BotController {
  private readonly logger = new Logger(BotController.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(SmartProfile)
    private readonly smartProfileRepo: Repository<SmartProfile>,
    private readonly matchingService: MatchingService,
    private readonly aiContentService: AiContentService,
  ) {}

  /**
   * ذخیره پروفایل از آنبوردینگ ربات
   */
  @Post('onboarding')
  async onboarding(
    @Body() payload: {
      telegramId: string;
      name: string;
      city: string;
      gender: string;
      age: number;
      personalityTraits: string[];
      interests: string[];
      preferredEventTypes?: string[];
    },
    @Headers('x-ravi-bot-secret') secret: string,
  ) {
    verifyBotSecret(secret);

    // جستجوی کاربر با telegramId
    let user = await this.userRepo.findOne({
      where: { telegram_id: payload.telegramId },
    });

    if (!user) {
      this.logger.log(`New bot user: ${payload.telegramId} - ${payload.name}`);
      // کاربر جدید فقط با telegramId ثبت می‌شود
      // بعداً با شماره تلفن ادغام می‌شود
      user = this.userRepo.create({
        telegram_id: payload.telegramId,
        name: payload.name,
      } as any);
      await this.userRepo.save(user);
    }

    // به‌روزرسانی پروفایل
    let profile = await this.profileRepo.findOne({ where: { user_id: user.id } });
    if (!profile) {
      profile = this.profileRepo.create({ user_id: user.id });
    }

    const nameParts = payload.name.split(' ');
    profile.first_name = nameParts[0] || payload.name;
    profile.last_name = nameParts.slice(1).join(' ') || null;
    profile.city = payload.city;
    profile.gender = payload.gender;
    profile.age = payload.age;
    profile.interests = payload.interests;
    await this.profileRepo.save(profile);

    // پروفایل هوشمند
    let smartProfile = await this.smartProfileRepo.findOne({ where: { user_id: user.id } });
    if (!smartProfile) {
      smartProfile = this.smartProfileRepo.create({ user_id: user.id });
    }

    // استنتاج تیپ ارتباطی از شخصیت
    const isExtrovert = payload.personalityTraits.includes('social');
    smartProfile.extroversion_score = isExtrovert ? 75 : 35;
    smartProfile.preferred_event_types = payload.preferredEventTypes || [];
    smartProfile.extracted_interests = payload.interests;
    await this.smartProfileRepo.save(smartProfile);

    return { success: true, userId: user.id };
  }

  /**
   * ورود به گروه تلگرام
   */
  @Post('group-join')
  async groupJoin(
    @Body() payload: {
      telegramId: string;
      groupId: string;
      eventId: string;
    },
    @Headers('x-ravi-bot-secret') secret: string,
  ) {
    verifyBotSecret(secret);

    const user = await this.userRepo.findOne({
      where: { telegram_id: payload.telegramId },
    });

    if (!user) {
      return { canJoin: false, message: 'کاربر یافت نشد. لطفاً ابتدا ثبت‌نام کنید' };
    }

    const smartProfile = await this.smartProfileRepo.findOne({
      where: { user_id: user.id },
    });

    if (smartProfile?.is_suspended) {
      return {
        canJoin: false,
        message: 'حساب شما موقتاً محدود شده است. لطفاً با پشتیبانی تماس بگیرید',
      };
    }

    return { canJoin: true, userId: user.id, credits: 100 };
  }

  /**
   * دریافت فیدبک از ربات
   */
  @Post('feedback')
  async feedback(
    @Body() payload: {
      telegramId: string;
      eventId: string;
      score: number;
    },
    @Headers('x-ravi-bot-secret') secret: string,
  ) {
    verifyBotSecret(secret);

    const user = await this.userRepo.findOne({
      where: { telegram_id: payload.telegramId },
    });

    if (!user) return { success: false };

    await this.matchingService.updateSmartProfileAfterEvent(
      user.id,
      payload.eventId,
      true, // فرض می‌شود شرکت کرده چون فیدبک داده
      payload.score * 20, // 1-5 → 20-100
    );

    this.logger.log(`Feedback received: user=${user.id} event=${payload.eventId} score=${payload.score}`);
    return { success: true };
  }

  /**
   * ثبت متادیتای تلگرام گروه (بدون خواندن محتوا)
   */
  @Post('group-metadata')
  async groupMetadata(
    @Body() payload: {
      groupId: string;
      eventId: string;
      members: Array<{
        telegramId: string;
        messageCount: number;
        responseTimeMinutes: number;
      }>;
    },
    @Headers('x-ravi-bot-secret') secret: string,
  ) {
    verifyBotSecret(secret);

    for (const member of payload.members) {
      const user = await this.userRepo.findOne({
        where: { telegram_id: member.telegramId },
      });
      if (!user) continue;

      let smartProfile = await this.smartProfileRepo.findOne({
        where: { user_id: user.id },
      });
      if (!smartProfile) {
        smartProfile = this.smartProfileRepo.create({ user_id: user.id });
      }

      smartProfile.telegram_messages_sent =
        (smartProfile.telegram_messages_sent || 0) + member.messageCount;
      smartProfile.telegram_message_rate = member.messageCount;
      smartProfile.telegram_response_time = member.responseTimeMinutes;

      // به‌روزرسانی سطح انرژی
      const energyAdjustment = member.messageCount > 20 ? 5 : member.messageCount < 3 ? -5 : 0;
      smartProfile.energy_level = Math.max(0, Math.min(100,
        (smartProfile.energy_level || 50) + energyAdjustment,
      ));

      await this.smartProfileRepo.save(smartProfile);
    }

    return { success: true, processed: payload.members.length };
  }

  /**
   * پاسخ به سوال پشتیبانی از ربات تلگرام
   */
  @Post('support/ask')
  async supportAsk(
    @Body() payload: { question: string; telegramId: string },
    @Headers('x-ravi-bot-secret') secret: string,
  ) {
    verifyBotSecret(secret);
    return this.aiContentService.answerSupportQuestion(payload.question);
  }

  /**
   * بررسی وضعیت ربات
   */
  @Get('health')
  async health() {
    return { status: 'ok', service: 'ravi-bot-backend', timestamp: new Date() };
  }
}
