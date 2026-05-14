/**
 * سرویس یادآوری SMS — لایه ۴ اتوماسیون
 * برای کاربران ثبت‌نام‌شده بدون رزرو، روزانه پیامک می‌فرستد
 */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class SmsReminderService {
  private readonly logger = new Logger(SmsReminderService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(SmartProfile) private smartProfileRepo: Repository<SmartProfile>,
    private readonly sms: SmsService,
  ) {}

  @Cron('0 10 * * *')
  async scheduledReminder() {
    this.logger.log('📨 ارسال یادآوری به کاربران بدون رزرو...');
    const r = await this.sendReminderToUnbookedUsers();
    this.logger.log(`✅ ${r.sent} ارسال | ${r.skipped} رد | ${r.failed} خطا`);
  }

  async sendReminderToUnbookedUsers(): Promise<{ sent: number; skipped: number; failed: number }> {
    const FRONTEND = process.env.FRONTEND_URL || 'https://raaviiplatform.com';
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000);
    const stats = { sent: 0, skipped: 0, failed: 0 };

    // ✅ اصلاح شد: createdAt (نام واقعی ستون) و isBanned به جای is_active
    const users = await this.userRepo.find({
      where: { createdAt: LessThan(sevenDaysAgo), isBanned: false },
      select: ['id', 'mobileNumber', 'name', 'createdAt'],
    });

    for (const user of users) {
      if (!user.mobileNumber) {
        stats.skipped++;
        continue;
      }

      const hasBooking = await this.bookingRepo.findOne({ where: { user_id: user.id, status: 'confirmed' } });
      if (hasBooking) {
        stats.skipped++;
        continue;
      }

      const sp = await this.smartProfileRepo.findOne({ where: { user_id: user.id } });

      // ✅ اصلاح شد: last_reminder_at اکنون در entity وجود دارد
      if (sp?.last_reminder_at) {
        const days = (Date.now() - new Date(sp.last_reminder_at).getTime()) / 86400_000;
        if (days < 14) {
          stats.skipped++;
          continue;
        }
      }

      const link = `${FRONTEND}/events?utm_source=sms&utm_medium=reminder&ref=${user.id}`;
      const name = user.name?.split(' ')[0] || 'دوست';
      const res = await this.sms.sendBookingReminder(user.mobileNumber, name, link);

      if (res.success) {
        stats.sent++;
        await this.updateReminderTime(user.id, sp);
      } else stats.failed++;

      await new Promise((r) => setTimeout(r, 100));
    }
    return stats;
  }

  async sendManualReminder(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user?.mobileNumber) return { success: false, message: 'کاربر یا موبایل یافت نشد' };
    const link = `${process.env.FRONTEND_URL || 'https://raaviiplatform.com'}/events?ref=${userId}`;
    const name = user.name?.split(' ')[0] || 'دوست';
    return this.sms.sendBookingReminder(user.mobileNumber, name, link);
  }

  private async updateReminderTime(userId: string, sp: SmartProfile | null) {
    if (sp) {
      await this.smartProfileRepo.update(sp.id, { last_reminder_at: new Date() });
    } else {
      await this.smartProfileRepo.save(this.smartProfileRepo.create({ user_id: userId, last_reminder_at: new Date() }));
    }
  }
}
