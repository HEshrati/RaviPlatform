import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { User } from '../../database/entities/user.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Event)
    private eventsRepo: Repository<Event>,
    @InjectRepository(Booking)
    private bookingsRepo: Repository<Booking>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Feedback)
    private feedbacksRepo: Repository<Feedback>,
  ) {}

  /**
   * ادمین: گرفتن لیست حضور و غیاب یک رویداد
   */
  async getAttendanceList(eventId: string) {
    const event = await this.eventsRepo.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('رویداد یافت نشد');

    const bookings = await this.bookingsRepo.find({
      where: { event_id: eventId, status: Not('cancelled') },
      relations: ['user', 'user.profile'],
    });

    const now = new Date();
    const eventEnded = new Date(event.end_date) < now;
    const eventStarted = new Date(event.start_date) < now;

    return {
      event: {
        id: event.id,
        title: event.title,
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.location,
        city: event.city,
        capacity: event.capacity,
        eventEnded,
        eventStarted,
      },
      attendees: bookings.map((b) => ({
        bookingId: b.id,
        userId: b.user_id,
        name: b.user?.name || 'نامشخص',
        phone: b.user?.mobileNumber,
        avatar: (b.user as any)?.profile?.avatar_url || b.user?.avatar,
        status: b.status,
        attended: b.attended,
        attendanceMarkedAt: b.attendance_marked_at,
        warningCount: (b.user as any)?.warning_count || 0,
        isBanned: b.user?.isBanned || false,
      })),
      summary: {
        total: bookings.length,
        attended: bookings.filter((b) => b.attended).length,
        notAttended: bookings.filter((b) => !b.attended && b.attendance_marked_at).length,
        notMarked: bookings.filter((b) => !b.attendance_marked_at).length,
      },
    };
  }

  /**
   * ادمین: ثبت حضور یا غیاب برای یک شرکت‌کننده
   */
  async markAttendance(
    eventId: string,
    userId: string,
    attended: boolean,
    adminId: string,
  ) {
    const event = await this.eventsRepo.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('رویداد یافت نشد');

    const now = new Date();
    if (new Date(event.start_date) > now) {
      throw new BadRequestException('رویداد هنوز شروع نشده - حضور و غیاب فقط بعد از شروع رویداد ثبت می‌شه');
    }

    const booking = await this.bookingsRepo.findOne({
      where: { event_id: eventId, user_id: userId, status: Not('cancelled') },
      relations: ['user'],
    });
    if (!booking) throw new NotFoundException('رزرو برای این کاربر یافت نشد');

    const wasAlreadyMarked = !!booking.attendance_marked_at;
    booking.attended = attended;
    booking.attendance_marked_at = new Date();
    await this.bookingsRepo.save(booking);

    // اگر غیاب بود، بررسی و هشدار/بن
    if (!attended && !wasAlreadyMarked) {
      await this.handleNoShow(booking.user, eventId);
    }

    return {
      success: true,
      bookingId: booking.id,
      userId,
      attended,
      message: attended ? '✅ حضور ثبت شد' : '⚠️ غیاب ثبت شد',
    };
  }

  /**
   * ثبت غیاب به صورت دسته‌ای (بعد از اتمام رویداد)
   */
  async bulkMarkAttendance(
    eventId: string,
    attendances: { userId: string; attended: boolean }[],
    adminId: string,
  ) {
    const results = await Promise.all(
      attendances.map((a) =>
        this.markAttendance(eventId, a.userId, a.attended, adminId).catch((e) => ({
          userId: a.userId,
          error: e.message,
        })),
      ),
    );

    // بعد از ثبت همه، بررسی آیا رویداد تموم شده و رتینگ ارسال بشه
    const event = await this.eventsRepo.findOne({ where: { id: eventId } });
    if (event && new Date(event.end_date) < new Date()) {
      await this.triggerRatingRequest(eventId);
    }

    return { results };
  }

  /**
   * منطق هشدار و بن برای غیاب
   */
  private async handleNoShow(user: User, eventId: string) {
    if (!user) return;

    // شمارش غیاب‌های تایید شده (بدون کنسل)
    const noShowCount = await this.bookingsRepo.count({
      where: { user_id: user.id, attended: false },
    });

    // به‌روزرسانی تعداد هشدار
    await this.usersRepo.update(user.id, {
      // @ts-ignore - فیلد اضافه شده توسط migration
      warning_count: noShowCount,
    } as any);

    if (noShowCount === 1) {
      // هشدار اول - ارسال اعلان (در محیط واقعی: ارسال SMS/notification)
      // TODO: ارسال SMS هشدار
    } else if (noShowCount >= 2) {
      // بن اکانت
      await this.usersRepo.update(user.id, { isBanned: true } as any);
      // TODO: ارسال SMS بن
    }
  }

  /**
   * ارسال درخواست رتینگ به شرکت‌کنندگان بعد از اتمام رویداد
   */
  async triggerRatingRequest(eventId: string) {
    const attendedBookings = await this.bookingsRepo.find({
      where: { event_id: eventId, attended: true },
      relations: ['user'],
    });

    // برای هر شرکت‌کننده، لیست بقیه شرکت‌کنندگان رو برمی‌گردونه تا بتونه رتینگ بده
    const participants = attendedBookings.map((b) => ({
      userId: b.user_id,
      name: b.user?.name,
    }));


    return {
      eventId,
      participants,
      message: 'درخواست رتینگ ارسال شد',
    };
  }

  /**
   * کاربر: دادن ستاره به شرکت‌کنندگان همنشینی
   */
  async submitRating(
    eventId: string,
    fromUserId: string,
    ratings: { targetUserId: string; stars: number; tags?: string[] }[],
  ) {
    const event = await this.eventsRepo.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('رویداد یافت نشد');

    if (new Date(event.end_date) > new Date()) {
      throw new BadRequestException('رویداد هنوز تموم نشده');
    }

    // بررسی اینکه کاربر در رویداد شرکت کرده
    const myBooking = await this.bookingsRepo.findOne({
      where: { event_id: eventId, user_id: fromUserId, attended: true },
    });
    if (!myBooking) {
      throw new ForbiddenException('فقط شرکت‌کنندگان می‌تونن رتینگ بدن');
    }

    const savedFeedbacks = [];
    for (const rating of ratings) {
      if (rating.targetUserId === fromUserId) continue; // به خودت رتینگ نمیدی
      if (rating.stars < 1 || rating.stars > 5) continue;

      // بررسی تکراری نبودن
      const existing = await this.feedbacksRepo.findOne({
        where: {
          event_id: eventId,
          user_id: fromUserId,
          target_id: rating.targetUserId,
        },
      });
      if (existing) continue;

      const feedback = this.feedbacksRepo.create({
        event_id: eventId,
        user_id: fromUserId,
        target_id: rating.targetUserId,
        rating: rating.stars,
        behavioral_tags: rating.tags || [],
        is_anonymous: false,
      });
      savedFeedbacks.push(await this.feedbacksRepo.save(feedback));
    }

    return {
      success: true,
      count: savedFeedbacks.length,
      message: `${savedFeedbacks.length} رتینگ با موفقیت ثبت شد`,
    };
  }

  /**
   * گرفتن وضعیت رتینگ کاربر برای یک رویداد (آیا باید popup نشون داده بشه)
   */
  async getRatingStatus(eventId: string, userId: string) {
    const event = await this.eventsRepo.findOne({ where: { id: eventId } });
    if (!event) return { shouldRate: false };

    const eventEnded = new Date(event.end_date) < new Date();
    if (!eventEnded) return { shouldRate: false };

    // بررسی اینکه کاربر در رویداد بوده
    const myBooking = await this.bookingsRepo.findOne({
      where: { event_id: eventId, user_id: userId, attended: true },
    });
    if (!myBooking) return { shouldRate: false };

    // بررسی اینکه قبلاً رتینگ داده یا نه
    const existingFeedbacks = await this.feedbacksRepo.find({
      where: { event_id: eventId, user_id: userId },
    });

    // گرفتن لیست بقیه شرکت‌کنندگان
    const otherAttendees = await this.bookingsRepo.find({
      where: { event_id: eventId, attended: true },
      relations: ['user'],
    });

    const participants = otherAttendees
      .filter((b) => b.user_id !== userId)
      .map((b) => ({
        userId: b.user_id,
        name: b.user?.name || 'نامشخص',
        avatar: b.user?.avatar,
        alreadyRated: existingFeedbacks.some((f) => f.target_id === b.user_id),
      }));

    const allRated = participants.every((p) => p.alreadyRated);

    return {
      shouldRate: participants.length > 0 && !allRated,
      participants,
      event: {
        id: event.id,
        title: event.title,
        end_date: event.end_date,
      },
    };
  }

  /**
   * آمار حضور برای داشبورد ادمین
   */
  async getAdminAttendanceDashboard(adminId: string) {
    const events = await this.eventsRepo.find({
      where: { created_by: adminId, is_active: true },
      order: { start_date: 'DESC' },
    });

    const now = new Date();
    const eventStats = await Promise.all(
      events.map(async (ev) => {
        const bookings = await this.bookingsRepo.find({
          where: { event_id: ev.id, status: Not('cancelled') },
        });
        const attended = bookings.filter((b) => b.attended).length;
        const noShow = bookings.filter((b) => !b.attended && b.attendance_marked_at).length;
        const pending = bookings.filter((b) => !b.attendance_marked_at).length;

        return {
          eventId: ev.id,
          title: ev.title,
          start_date: ev.start_date,
          end_date: ev.end_date,
          city: ev.city,
          category: ev.category || ev.event_type,
          isCompleted: new Date(ev.end_date) < now,
          isStarted: new Date(ev.start_date) < now,
          stats: {
            total: bookings.length,
            attended,
            noShow,
            pending,
            attendanceRate: bookings.length > 0 ? Math.round((attended / bookings.length) * 100) : 0,
          },
        };
      }),
    );

    const completedEvents = eventStats.filter((e) => e.isCompleted);
    const avgAttendance =
      completedEvents.length > 0
        ? Math.round(
            completedEvents.reduce((s, e) => s + e.stats.attendanceRate, 0) /
              completedEvents.length,
          )
        : 0;

    return {
      events: eventStats,
      summary: {
        totalEvents: events.length,
        completedEvents: completedEvents.length,
        upcomingEvents: eventStats.filter((e) => !e.isStarted).length,
        avgAttendanceRate: avgAttendance,
      },
    };
  }
}
