/**
 * سرویس ادغام ایونت‌ها — لایه ۴ اتوماسیون
 * هر ۳۰ دقیقه بررسی می‌کند؛ ایونت‌هایی که ۱۲ ساعت دیگر شروع
 * می‌شوند و ظرفیت کافی ندارند با هم ادغام می‌شوند.
 */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Event }   from './entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { User }    from '../users/entities/user.entity';
import { SmsService } from '../sms/sms.service';

export interface MergeDetail {
  sourceEventId: string; targetEventId: string;
  movedUsers: number; reason: string;
}

@Injectable()
export class EventMergeService {
  private readonly logger = new Logger(EventMergeService.name);

  constructor(
    @InjectRepository(Event)   private eventRepo:   Repository<Event>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(User)    private userRepo:    Repository<User>,
    private readonly sms: SmsService,
  ) {}

  @Cron('*/30 * * * *')
  async scheduledMerge() {
    this.logger.log('⏰ بررسی ادغام ایونت‌ها...');
    try {
      const r = await this.mergeUpcomingEvents();
      if (r.mergedCount > 0) this.logger.log(`✅ ${r.mergedCount} ادغام انجام شد`);
    } catch (e) { this.logger.error('❌ خطا:', e); }
  }

  async mergeUpcomingEvents(): Promise<{ mergedCount: number; details: MergeDetail[] }> {
    const now = new Date();
    const t12 = new Date(now.getTime() + 12 * 3600_000);
    const t13 = new Date(now.getTime() + 13 * 3600_000);

    const events = await this.eventRepo.find({
      where: { start_date: Between(t12, t13), is_active: true },
      order: { start_date: 'ASC' },
    });
    if (events.length < 2) return { mergedCount: 0, details: [] };

    const groups = this.groupByCategoryCity(events);
    const details: MergeDetail[] = [];

    for (const evts of Object.values(groups)) {
      if (evts.length < 2) continue;
      details.push(...await this.mergeGroup(evts));
    }
    return { mergedCount: details.length, details };
  }

  private groupByCategoryCity(events: Event[]): Record<string, Event[]> {
    return events.reduce((acc, e) => {
      const k = `${e.event_type||'g'}_${e.city||'x'}`;
      (acc[k] = acc[k] || []).push(e);
      return acc;
    }, {} as Record<string, Event[]>);
  }

  private async mergeGroup(events: Event[]): Promise<MergeDetail[]> {
    events.sort((a, b) => b.current_bookings - a.current_bookings);
    const details: MergeDetail[] = [];

    for (const src of events.filter(e => e.current_bookings < Math.ceil(e.capacity * 0.5))) {
      const tgt = events.find(e =>
        e.id !== src.id &&
        !(e as any).merged_into &&
        e.current_bookings + src.current_bookings <= e.capacity,
      );
      if (!tgt) continue;

      const bookings = await this.bookingRepo.find({
        where: { event_id: src.id, status: 'confirmed' },
        relations: ['user'],
      });

      for (const b of bookings) {
        await this.bookingRepo.update(b.id, {
          event_id: tgt.id,
          metadata: { ...(b.metadata as any || {}), merged_from: src.id, merged_at: new Date().toISOString() } as any,
        });
      }

      await this.eventRepo.update(tgt.id, { current_bookings: tgt.current_bookings + bookings.length });
      await this.eventRepo.update(src.id, { current_bookings: 0, is_active: false, merged_into: tgt.id } as any);

      const mergeDate = new Date(tgt.start_date).toLocaleDateString('fa-IR');
      const mergeTime = new Date(tgt.start_date).toLocaleTimeString('fa-IR', { hour:'2-digit', minute:'2-digit' });
      const siteUrl   = `${process.env.FRONTEND_URL||'https://raaviiplatform.com'}/events/${tgt.id}`;

      for (const b of bookings) {
        if (b.user?.mobileNumber)
          await this.sms.sendMergeNotification(b.user.mobileNumber, tgt.title, mergeDate, mergeTime, siteUrl);
      }

      details.push({ sourceEventId: src.id, targetEventId: tgt.id, movedUsers: bookings.length,
        reason: `ادغام ایونت کم‌ظرفیت (${src.current_bookings}/${src.capacity})` });
      this.logger.log(`✅ ادغام: ${bookings.length} نفر → "${tgt.title}"`);
    }
    return details;
  }

  async manualMerge(sourceEventId: string, targetEventId: string): Promise<MergeDetail> {
    const [src, tgt] = await Promise.all([
      this.eventRepo.findOne({ where: { id: sourceEventId } }),
      this.eventRepo.findOne({ where: { id: targetEventId } }),
    ]);
    if (!src || !tgt) throw new Error('ایونت یافت نشد');
    if (tgt.current_bookings + src.current_bookings > tgt.capacity) throw new Error('ظرفیت کافی نیست');

    const bookings = await this.bookingRepo.find({ where: { event_id: sourceEventId, status: 'confirmed' }, relations: ['user'] });
    for (const b of bookings)
      await this.bookingRepo.update(b.id, { event_id: targetEventId,
        metadata: { ...(b.metadata as any||{}), merged_from: sourceEventId, manual: true } as any });

    await this.eventRepo.update(targetEventId, { current_bookings: tgt.current_bookings + bookings.length });
    await this.eventRepo.update(sourceEventId, { current_bookings: 0, is_active: false });

    const siteUrl = `${process.env.FRONTEND_URL||'https://raaviiplatform.com'}/events/${targetEventId}`;
    const mergeDate = new Date(tgt.start_date).toLocaleDateString('fa-IR');
    const mergeTime = new Date(tgt.start_date).toLocaleTimeString('fa-IR', { hour:'2-digit', minute:'2-digit' });
    for (const b of bookings)
      if (b.user?.mobileNumber)
        await this.sms.sendMergeNotification(b.user.mobileNumber, tgt.title, mergeDate, mergeTime, siteUrl);

    return { sourceEventId, targetEventId, movedUsers: bookings.length, reason: 'ادغام دستی ادمین' };
  }
}
