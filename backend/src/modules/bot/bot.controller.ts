import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Request,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { User } from '../../database/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Event } from '../events/entities/event.entity';

// ─────────────────────────────────────────────────────────────
// in-memory store برای توکن‌های deep link (۱۰ دقیقه)
// ─────────────────────────────────────────────────────────────

const linkTokenStore = new Map<string, { userId: string; expiresAt: number }>();

// پاکسازی هر ۵ دقیقه
setInterval(
  () => {
    const now = Date.now();
    for (const [token, data] of linkTokenStore.entries()) {
      if (data.expiresAt < now) {
        linkTokenStore.delete(token);
      }
    }
  },
  5 * 60 * 1000,
);

// ─────────────────────────────────────────────────────────────

function verifyBotSecret(secret?: string) {
  if (!secret || secret !== process.env.RAVI_BOT_SECRET) {
    throw new UnauthorizedException('Invalid bot secret');
  }
}

// ─────────────────────────────────────────────────────────────

@Controller('bot')
export class BotController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  // ═══════════════════════════════════════════════════════════
  // 1) تولید deep link برای اتصال تلگرام
  // GET /api/bot/generate-link-token
  // ═══════════════════════════════════════════════════════════

  @Get('generate-link-token')
  @UseGuards(JwtAuthGuard)
  async generateLinkToken(@Request() req): Promise<{
    deepLink: string;
    expiresInSeconds: number;
    alreadyLinked: boolean;
  }> {
    const userId: string = req.user.id;

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const botUsername = process.env.BOT_USERNAME || 'raaviplatformbot';

    // اگر قبلاً لینک شده
    if (user.telegram_id) {
      return {
        deepLink: `https://t.me/${botUsername}?start=already_linked`,
        expiresInSeconds: 0,
        alreadyLinked: true,
      };
    }

    const token = crypto.randomBytes(9).toString('base64url');

    const EXPIRES_MS = 10 * 60 * 1000;

    linkTokenStore.set(token, {
      userId,
      expiresAt: Date.now() + EXPIRES_MS,
    });

    return {
      deepLink: `https://t.me/${botUsername}?start=${token}`,
      expiresInSeconds: EXPIRES_MS / 1000,
      alreadyLinked: false,
    };
  }

  // ═══════════════════════════════════════════════════════════
  // 2) تأیید توکن و لینک کردن تلگرام
  // POST /api/bot/verify-link-token
  // ═══════════════════════════════════════════════════════════

  @Post('verify-link-token')
  async verifyLinkToken(
    @Body()
    body: {
      token: string;
      telegramId: string;
      telegramUsername?: string;
    },
    @Headers('x-ravi-bot-secret') secret: string,
  ): Promise<{
    success: boolean;
    message?: string;
    user?: {
      name: string;
      city: string;
      neighborhood: string;
      interests: string[];
      alreadyLinked: boolean;
    };
  }> {
    verifyBotSecret(secret);

    const { token, telegramId, telegramUsername } = body;

    // حالت already_linked
    if (token === 'already_linked') {
      const user = await this.userRepo.findOne({
        where: { telegram_id: telegramId },
      });

      if (!user) {
        return {
          success: false,
          message: 'حساب تلگرام لینک‌نشده‌ای یافت نشد.',
        };
      }

      const profile = await this.profileRepo.findOne({
        where: { user_id: user.id },
      });

      return {
        success: true,
        user: {
          name: user.name || 'کاربر',
          city: profile?.city || '',
          neighborhood: profile?.neighborhood || '',
          interests: profile?.interests || [],
          alreadyLinked: true,
        },
      };
    }

    const tokenData = linkTokenStore.get(token);

    if (!tokenData) {
      return {
        success: false,
        message: 'لینک منقضی یا نامعتبر است. از داشبورد دوباره لینک بگیر.',
      };
    }

    if (tokenData.expiresAt < Date.now()) {
      linkTokenStore.delete(token);
      return {
        success: false,
        message: 'لینک منقضی شده. از داشبورد دوباره لینک بگیر.',
      };
    }

    const user = await this.userRepo.findOne({
      where: { id: tokenData.userId },
    });

    if (!user) {
      linkTokenStore.delete(token);
      return {
        success: false,
        message: 'کاربر یافت نشد.',
      };
    }

    // بررسی تداخل
    const conflict = await this.userRepo.findOne({
      where: { telegram_id: telegramId },
    });

    if (conflict && conflict.id !== user.id) {
      return {
        success: false,
        message: 'این حساب تلگرام قبلاً به یک حساب دیگر وصل شده.',
      };
    }

    user.telegram_id = telegramId;

    if (telegramUsername) {
      user.telegram_username = telegramUsername;
    }

    await this.userRepo.save(user);

    linkTokenStore.delete(token);

    const profile = await this.profileRepo.findOne({
      where: { user_id: user.id },
    });

    return {
      success: true,
      user: {
        name: user.name || 'کاربر',
        city: profile?.city || '',
        neighborhood: profile?.neighborhood || '',
        interests: profile?.interests || [],
        alreadyLinked: false,
      },
    };
  }

  // ═══════════════════════════════════════════════════════════
  // 3) رویدادهای هوشمند
  // GET /api/bot/smart-events/:telegramId
  // ═══════════════════════════════════════════════════════════

  @Get('smart-events/:telegramId')
  async smartEvents(
    @Param('telegramId') telegramId: string,
    @Headers('x-ravi-bot-secret') secret: string,
  ): Promise<{
    events: Array<{
      id: string;
      title: string;
      city: string;
      location: string;
      start_date: string;
      price: number;
      event_type: string;
      spotsLeft: number;
      matchScore: number;
    }>;
    userName: string;
    userCity: string;
  }> {
    verifyBotSecret(secret);

    const user = await this.userRepo.findOne({
      where: { telegram_id: telegramId },
    });

    if (!user) {
      return {
        events: [],
        userName: '',
        userCity: '',
      };
    }

    const profile = await this.profileRepo.findOne({
      where: { user_id: user.id },
    });

    const userCity = profile?.city || '';
    const userInterests: string[] = profile?.interests || [];

    const qb = this.eventRepo
      .createQueryBuilder('e')
      .where('e.is_active = :active', {
        active: true,
      })
      .andWhere('e.start_date > :now', {
        now: new Date(),
      });

    if (userCity) {
      qb.andWhere('e.city = :city', {
        city: userCity,
      });
    }

    const events = await qb.orderBy('e.start_date', 'ASC').take(10).getMany();

    const scored = events.map((ev) => {
      const evTags: string[] = (ev as any).tags || [];
      const evType: string = (ev as any).event_type || '';

      let score = 50;

      const matched = userInterests.filter(
        (i) =>
          evTags.some((t) => t.toLowerCase().includes(i.toLowerCase())) ||
          evType.toLowerCase().includes(i.toLowerCase()),
      );

      score += matched.length * 15;

      if ((ev as any).city === userCity) {
        score += 20;
      }

      score = Math.min(score, 98);

      const capacity = Number((ev as any).capacity) || 10;

      const booked = Number((ev as any).current_bookings) || 0;

      const spotsLeft = Math.max(0, capacity - booked);

      return {
        id: ev.id,
        title: ev.title,
        city: (ev as any).city || '',
        location: (ev as any).location || '',
        start_date: ev.start_date ? new Date(ev.start_date).toISOString() : '',
        price: Number((ev as any).price) || 0,
        event_type: (ev as any).event_type || '',
        spotsLeft,
        matchScore: score,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    return {
      events: scored.slice(0, 5),
      userName: user.name || 'کاربر',
      userCity,
    };
  }
}
