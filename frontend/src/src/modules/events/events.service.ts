import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { Booking } from '../bookings/entities/booking.entity';
import { User } from '../../database/entities/user.entity';

// ─── تایپ پروفایل شخصیتی ──────────────────────────────────────────────────
export interface PersonalityProfile {
  introExtro: number;    // 1-5: درون‌گرا → برون‌گرا
  motivation: number;    // 1-5: نیاز به جرقه → خودانگیخته
  career: number;        // 1-5: نارضایتی → رضایت شغلی
  decision: string;      // 'فکر' | 'احساس'
  vibe: string;          // 'آرام' | 'پرهیجان'
  travel: string;        // 'برنامه‌ریزی' | 'ماجراجویی'
  location: string;      // 'شهر' | 'طبیعت' | 'هر جا'
  relationship: string;  // 'مجرد' | 'متأهل' | 'در رابطه' | 'پیچیده'
  city: string;
  gender: string;
}

// ─── الگوریتم امتیاز مچینگ ─────────────────────────────────────────────────
export function calcMatchScore(
  userProfile: PersonalityProfile,
  event: Event,
): number {
  let score = 50; // بیس امتیاز

  // ۱. شهر مطابقت دارد؟
  if (event.city && userProfile.city) {
    if (event.city === userProfile.city) score += 30;
    else score -= 20;
  }

  // ۲. نوع رویداد با شخصیت تطابق دارد؟
  const type = (event.event_type || event.category || '').toLowerCase();

  if (type.includes('hampa') || type.includes('outdoor') || type.includes('هم‌پا')) {
    if (userProfile.location === 'منظره‌ی کوه و جنگل و صدای باد') score += 15;
    if (userProfile.introExtro >= 4) score += 5;
  }
  if (type.includes('hamneshin') || type.includes('hamghesse') || type.includes('همنشین')) {
    if (userProfile.introExtro <= 2) score += 10;
    if (userProfile.vibe === 'یه کافه‌ی آروم و دنج با میزهای همیشگی') score += 10;
  }
  if (type.includes('hambazi') || type.includes('hamteymi') || type.includes('هم‌بازی')) {
    if (userProfile.introExtro >= 4) score += 10;
    if (userProfile.motivation >= 4) score += 5;
  }
  if (type.includes('hamsohbat') || type.includes('hamfekr') || type.includes('هم‌صحبت')) {
    if (userProfile.decision === 'بیشتر با فکر و تحلیل جلو میرم') score += 10;
    if (userProfile.introExtro >= 3) score += 5;
  }
  if (type.includes('hamamooz') || type.includes('hamkar') || type.includes('هم‌آموز')) {
    if (userProfile.motivation >= 4) score += 10;
    if (userProfile.career <= 2) score += 8; // دنبال رشده
  }

  // ۳. انرژی رویداد
  const energyHigh = ['hambazi', 'hamteymi', 'هم‌بازی', 'هم‌تیمی'];
  const energyLow  = ['hamneshin', 'hamsohbat', 'همنشین', 'هم‌صحبت'];
  if (energyHigh.some(t => type.includes(t)) && userProfile.introExtro >= 4) score += 5;
  if (energyLow.some(t => type.includes(t)) && userProfile.introExtro <= 2) score += 5;

  // ۴. ظرفیت خالی بونوس
  if (event.capacity - event.current_bookings > 3) score += 5;

  return Math.max(0, Math.min(100, score));
}

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createEventDto: CreateEventDto & { created_by?: string }): Promise<Event> {
    // Handle camelCase → snake_case field mapping
    const dto: any = { ...createEventDto };
    if (dto.startDate && !dto.start_date) dto.start_date = new Date(dto.startDate);
    if (dto.endDate && !dto.end_date) dto.end_date = new Date(dto.endDate);
    if (!dto.start_date && dto.startDate) dto.start_date = new Date(dto.startDate);
    if (!dto.end_date) dto.end_date = dto.start_date ? new Date(new Date(dto.start_date).getTime() + 2 * 60 * 60 * 1000) : new Date();
    if (!dto.event_type) dto.event_type = dto.category || 'hamneshin';
    if (!dto.price) dto.price = 0;
    // camelCase → snake_case برای is_active
    if (dto.isActive !== undefined && dto.is_active === undefined) dto.is_active = dto.isActive;
    // اطمینان از فعال بودن پیش‌فرض
    if (dto.is_active === undefined) dto.is_active = true;
    
    const event = this.eventsRepository.create(dto);
    return await this.eventsRepository.save(event) as any as Event;
  }

  /**
   * لیست رویدادها — اگر پروفایل کاربر بده، با مچینگ مرتب می‌شه
   */
  async findAll(query: {
    page?: number;
    limit?: number;
    city?: string;
    event_type?: string;
    userId?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const qb = this.eventsRepository
      .createQueryBuilder('event')
      .where('event.is_active = :isActive', { isActive: true });

    if (query.city) qb.andWhere('event.city ILIKE :city', { city: `%${query.city}%` });
    if (query.event_type) qb.andWhere('event.event_type = :type', { type: query.event_type });

    const [data, total] = await qb
      .orderBy('event.start_date', 'ASC')
      .skip(skip).take(limit * 3) // بیشتر بگیر تا مرتب‌سازی بهتر باشه
      .getManyAndCount();

    let events = data.map((e) => ({
      ...e,
      startDate: e.start_date,       // camelCase alias for frontend
      endDate: e.end_date,           // camelCase alias for frontend
      reservedCount: e.current_bookings,
      available_slots: e.capacity - e.current_bookings,
      matchScore: 50,
    }));

    // اگر userId داریم، با پروفایل مرتب کن
    if (query.userId) {
      try {
        const profile = await this.getUserPersonalityProfile(query.userId);
        if (profile) {
          events = events.map((e) => ({
            ...e,
            matchScore: calcMatchScore(profile, e as any),
          }));
          events.sort((a, b) => b.matchScore - a.matchScore);
        }
      } catch { /* بدون مچینگ پیش می‌ریم */ }
    }

    return {
      events: events.slice(0, limit),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * دریافت پروفایل شخصیتی کاربر از test_results
   */
  async getUserPersonalityProfile(userId: string): Promise<PersonalityProfile | null> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) return null;

    // دریافت آخرین نتیجه تست
    const result = await (this.usersRepository.manager
      .getRepository('test_results') as any)
      ?.findOne({
        where: { user_id: userId, test_name: 'personality_hamneshin_v2' },
        order: { completed_at: 'DESC' },
      }).catch(() => null);

    if (!result?.scores) return null;

    const s = result.scores;
    const mainResult = result.main_result ? JSON.parse(result.main_result) : {};

    return {
      introExtro: s.q4 || 3,
      motivation: s.q5 || 3,
      career: s.q6 || 3,
      decision: mainResult.decision || '',
      vibe: mainResult.vibe || '',
      travel: mainResult.travel || '',
      location: mainResult.location || '',
      relationship: mainResult.relationship || '',
      city: '', // از profile می‌آد
      gender: '',
    };
  }

  /**
   * پیشنهاد گروهی بعد از اولین رزرو + بر اساس تلگرام
   */
  async getGroupRecommendations(userId: string): Promise<{
    events: any[];
    reason: string;
    groupSuggestions?: any[];
  }> {
    // بررسی دارای رزرو قبلی هست؟
    const bookings = await this.bookingsRepository.find({
      where: { user_id: userId },
    });

    const profile = await this.getUserPersonalityProfile(userId);
    const allEvents = await this.findAll({ limit: 50, userId });

    if (bookings.length === 0) {
      // اولین بار — فقط بر اساس تست
      return {
        events: allEvents.events.slice(0, 5),
        reason: 'بر اساس پاسخ‌های تست شخصیتی',
      };
    }

    // بعد از اولین رزرو — پیشنهاد گروهی با آدم‌های مشابه
    const attendedEventIds = bookings.map((b) => b.event_id);
    const coAttendees = await this.bookingsRepository
      .createQueryBuilder('b')
      .where('b.event_id IN (:...eventIds)', { eventIds: attendedEventIds })
      .andWhere('b.user_id != :userId', { userId })
      .select(['b.user_id'])
      .distinct(true)
      .limit(20)
      .getRawMany();

    const coUserIds = coAttendees.map((c) => c.b_user_id);

    // رویدادهایی که هم‌رزروان هم ثبت‌نام کردن
    let groupEvents: any[] = [];
    if (coUserIds.length > 0) {
      const coBookings = await this.bookingsRepository
        .createQueryBuilder('b')
        .where('b.user_id IN (:...userIds)', { userIds: coUserIds })
        .andWhere('b.event_id NOT IN (:...attended)', { attended: attendedEventIds })
        .select(['b.event_id', 'COUNT(b.user_id) as count'])
        .groupBy('b.event_id')
        .orderBy('count', 'DESC')
        .limit(5)
        .getRawMany();

      const groupEventIds = coBookings.map((b) => b.b_event_id);
      if (groupEventIds.length > 0) {
        const gEvents = await this.eventsRepository
          .createQueryBuilder('e')
          .where('e.id IN (:...ids)', { ids: groupEventIds })
          .andWhere('e.is_active = true')
          .getMany();

        groupEvents = gEvents.map((e) => ({
          ...e,
          reservedCount: e.current_bookings,
          matchScore: profile ? calcMatchScore(profile, e) : 70,
          suggestionReason: 'افرادی که باهاشون همنشین بودی این رو دوست دارن',
        }));
      }
    }

    return {
      events: allEvents.events.slice(0, 5),
      reason: 'ترکیب شخصیت و تجربه‌های قبلی',
      groupSuggestions: groupEvents,
    };
  }

  /**
   * رزرو رویداد - با بررسی بن و قانون ۲ بار غیاب
   */
  async bookEvent(eventId: string, userId: string): Promise<{ booking: any; warning?: string }> {
    const event = await this.eventsRepository.findOne({ where: { id: eventId, is_active: true } });
    if (!event) throw new NotFoundException('رویداد یافت نشد');

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('کاربر یافت نشد');

    // بررسی بن
    if (user.isBanned) {
      throw new BadRequestException('⛔ حساب کاربری شما به دلیل ۲ بار غیاب غیرمجاز مسدود شده است. برای رفع مسدودیت با پشتیبانی تماس بگیرید');
    }

    // بررسی ظرفیت
    if (event.current_bookings >= event.capacity) {
      throw new BadRequestException('ظرفیت رویداد تکمیل است');
    }

    // بررسی رزرو تکراری
    const existing = await this.bookingsRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });
    if (existing && existing.status !== 'cancelled') {
      throw new BadRequestException('قبلاً این رویداد را رزرو کرده‌اید');
    }

    const booking = this.bookingsRepository.create({
      event_id: eventId,
      user_id: userId,
      status: 'confirmed',
      confirmed_at: new Date(),
      booking_code: `RV-${Date.now()}-${Math.random().toString(36).substr(2,6).toUpperCase()}`,
    } as any);
    const saved = await this.bookingsRepository.save(booking);
    await this.eventsRepository.increment({ id: eventId }, 'current_bookings', 1);

    // تعداد غیاب‌های قبلی
    const noShowCount = await this.bookingsRepository.count({
      where: { user_id: userId, attended: false },
    });

    return {
      booking: saved,
      ...(noShowCount === 1 ? {
        warning: '⚠️ توجه: یک بار در رویداد قبلی شرکت نکرده‌اید. در صورت عدم شرکت مجدد، حساب شما مسدود خواهد شد.',
      } : {}),
    };
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('همنشینی یافت نشد');
    return event;
  }

  async findByCreator(creatorId: string) {
    const [events, total] = await this.eventsRepository.findAndCount({
      where: { created_by: creatorId },
      order: { created_at: 'DESC' },
    });
    return {
      events: events.map((e) => ({
        ...e,
        reservedCount: e.current_bookings,
        available_slots: e.capacity - e.current_bookings,
      })),
      total,
    };
  }

  async update(id: string, data: Partial<Event>): Promise<Event> {
    const event = await this.findOne(id);
    
    // PRICE LOCK: prevent price changes after event starts
    if (data.price !== undefined && event.start_date) {
      const now = new Date();
      const startDate = new Date(event.start_date);
      if (startDate <= now) {
        delete data.price;
        console.warn(`[EVENTS] Price change blocked for event ${id} — event already started`);
      }
    }
    
    Object.assign(event, data);
    return await this.eventsRepository.save(event);
  }

  async incrementBookings(id: string): Promise<void> {
    await this.eventsRepository.increment({ id }, 'current_bookings', 1);
  }

  async decrementBookings(id: string): Promise<void> {
    await this.eventsRepository.decrement({ id }, 'current_bookings', 1);
  }

  async getLocationForUser(eventId: string, userId: string, isAdmin: boolean) {
    const event = await this.findOne(eventId);
    const now = new Date();
    const startDate = new Date(event.start_date);
    const msUntilStart = startDate.getTime() - now.getTime();
    const minutesUntilStart = Math.ceil(msUntilStart / (1000 * 60));
    const hoursUntilStart = msUntilStart / (1000 * 60 * 60);

    if (hoursUntilStart > 10) {
      return { location: null, revealed: false, minutesRemaining: minutesUntilStart };
    }
    if (isAdmin) {
      return { location: event.location, revealed: true, minutesRemaining: 0 };
    }

    const booking = await this.bookingsRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });
    if (!booking) {
      return { location: null, revealed: false, minutesRemaining: minutesUntilStart };
    }
    return { location: event.location, revealed: true, minutesRemaining: 0 };
  }

  async updateLocationAndNotify(eventId: string, location: string, city: string) {
    const event = await this.update(eventId, { location, city } as any);
    const bookings = await this.bookingsRepository.find({
      where: { event_id: eventId },
      relations: ['user'],
    });

    const OTP_API_KEY = process.env.OTP_API_KEY || '';
    const IS_PROD = process.env.NODE_ENV === 'production';
    const SMS_TEMPLATE_ID = parseInt(process.env.LOCATION_CHANGE_TEMPLATE_ID || '100001');
    const results = { notified: 0, failed: 0 };

    for (const booking of bookings) {
      if (!booking.user?.mobileNumber) continue;
      try {
        if (IS_PROD && OTP_API_KEY) {
          await fetch('https://api.sms.ir/v1/send/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': OTP_API_KEY },
            body: JSON.stringify({
              mobile: booking.user.mobileNumber,
              templateId: SMS_TEMPLATE_ID,
              parameters: [
                { name: 'EventTitle', value: event.title },
                { name: 'NewLocation', value: `${city} - ${location}` },
              ],
            }),
          });
        } else {
        }
        results.notified++;
      } catch { results.failed++; }
    }

    return {
      success: true,
      message: `مکان بروزرسانی شد. ${results.notified} نفر اطلاع‌رسانی شدند.`,
      ...results,
    };
  }

  async getEventAttendees(eventId: string) {
    const bookings = await this.bookingsRepository.find({
      where: { event_id: eventId },
      relations: ['user'],
    });
    const users = bookings.filter((b) => b.user).map((b) => ({
      id: b.user.id,
      name: b.user.name,
      mobileNumber: b.user.mobileNumber,
      avatar: b.user.avatar,
      bookingStatus: b.status,
    }));
    return { users };
  }

  async getAdminStats(creatorId: string) {
    const events = await this.eventsRepository.find({
      where: { created_by: creatorId },
      order: { start_date: 'DESC' },
    });
    const now = new Date();
    const completed = events.filter((e) => new Date(e.end_date) < now);

    const eventStats = await Promise.all(
      completed.map(async (ev) => {
        const bookings = await this.bookingsRepository.find({ where: { event_id: ev.id } });
        const attended = bookings.filter((b) => b.attended).length;
        const reserved = bookings.length;
        const successRate = reserved > 0 ? Math.round((attended / reserved) * 100) : 0;
        return {
          eventId: ev.id,
          title: ev.title,
          capacity: ev.capacity,
          reserved,
          attended,
          successRate,
          date: new Date(ev.start_date).toLocaleDateString('fa-IR'),
        };
      }),
    );

    const avgSuccessRate =
      eventStats.length > 0
        ? Math.round(eventStats.reduce((s, e) => s + e.successRate, 0) / eventStats.length)
        : 0;

    return { events: eventStats, totalEvents: events.length, avgSuccessRate };
  }
}
