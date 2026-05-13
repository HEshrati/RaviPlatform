/**
 * سرویس محبوب‌ترین برنامه‌ها — لایه ۹ داشبورد
 * امتیاز ترکیبی = 40% نظر + 40% حضور + 20% رزرو
 */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event }   from '../events/entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';

const TYPE_LABELS: Record<string,string> = {
  hamneshin:'همنشینی', hambazi:'هم‌بازی', hamsohbat:'هم‌صحبت',
  hampa:'هم‌پا', hamteymi:'هم‌تیمی', hamamooz:'هم‌آموز',
};

@Injectable()
export class PopularEventsService {
  private readonly logger = new Logger(PopularEventsService.name);

  constructor(
    @InjectRepository(Event)   private eventRepo:   Repository<Event>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
  ) {}

  async getPopularPrograms(limit = 10) {
    const now    = new Date();
    const events = (await this.eventRepo.find({ where:{ is_active:true }, order:{ start_date:'DESC' } }))
      .filter(e => new Date(e.end_date) < now);

    if (!events.length) return { topEvents:[], topEventTypes:[], topCities:[], summary:{totalEventsRated:0,overallAvgRating:0,mostPopularType:'-',mostPopularCity:'-'} };

    const stats = await Promise.all(events.map(async ev => {
      const bookings   = await this.bookingRepo.find({ where:{ event_id: ev.id } });
      const attended   = bookings.filter(b => b.attended).length;
      const rated      = bookings.filter(b => (b as any).rating > 0);
      const avgRating  = rated.length ? rated.reduce((s,b) => s + ((b as any).rating||0), 0) / rated.length : 0;
      const attRate    = bookings.length ? attended / bookings.length : 0;
      const bookScore  = Math.min(bookings.length / ev.capacity, 1);
      const popularity = (avgRating/5*40) + (attRate*40) + (bookScore*20);
      return {
        eventId: ev.id, title: ev.title, eventType: ev.event_type || 'general',
        city: ev.city || '-', startDate: ev.start_date,
        totalRatings: rated.length, avgRating: Math.round(avgRating*10)/10,
        attendanceRate: Math.round(attRate*100), popularityScore: Math.round(popularity),
      };
    }));

    const sorted = stats.filter(s => s.totalRatings > 0 || s.attendanceRate > 0)
      .sort((a,b) => b.popularityScore - a.popularityScore);

    const typeAgg: Record<string,{ r:number; c:number; n:number }> = {};
    const cityAgg: Record<string,{ r:number; c:number; n:number }> = {};
    for (const s of stats) {
      const t = s.eventType;
      if (!typeAgg[t]) typeAgg[t] = { r:0, c:0, n:0 };
      typeAgg[t].n++;
      if (s.avgRating > 0) { typeAgg[t].r += s.avgRating; typeAgg[t].c++; }

      const cy = s.city;
      if (!cityAgg[cy]) cityAgg[cy] = { r:0, c:0, n:0 };
      cityAgg[cy].n++;
      if (s.avgRating > 0) { cityAgg[cy].r += s.avgRating; cityAgg[cy].c++; }
    }

    const topEventTypes = Object.entries(typeAgg)
      .map(([t,v]) => ({ type:t, label:TYPE_LABELS[t]||t, avgRating: v.c ? Math.round(v.r/v.c*10)/10 : 0, count:v.n }))
      .sort((a,b) => b.avgRating - a.avgRating).slice(0,5);

    const topCities = Object.entries(cityAgg).filter(([c]) => c !== '-')
      .map(([c,v]) => ({ city:c, avgRating: v.c ? Math.round(v.r/v.c*10)/10 : 0, count:v.n }))
      .sort((a,b) => b.avgRating - a.avgRating).slice(0,5);

    const overallAvg = sorted.length ? sorted.reduce((s,e) => s+e.avgRating, 0)/sorted.length : 0;
    return {
      topEvents: sorted.slice(0, limit), topEventTypes, topCities,
      summary: {
        totalEventsRated: stats.filter(s => s.totalRatings > 0).length,
        overallAvgRating: Math.round(overallAvg*10)/10,
        mostPopularType: topEventTypes[0]?.label || '-',
        mostPopularCity: topCities[0]?.city || '-',
      },
    };
  }

  async rateEvent(bookingId: string, userId: string, rating: number, comment?: string) {
    if (rating < 1 || rating > 5) throw new Error('امتیاز باید ۱ تا ۵ باشد');
    const b = await this.bookingRepo.findOne({ where:{ id:bookingId, user_id:userId } });
    if (!b) throw new Error('رزرو یافت نشد');
    if (!b.attended) throw new Error('فقط شرکت‌کنندگان می‌توانند امتیاز دهند');
    await this.bookingRepo.update(bookingId, { rating, rating_comment:comment, rated_at:new Date() } as any);
  }

  async getWeeklyInsightData() {
    const oneWeekAgo = new Date(Date.now() - 7*86400_000);
    const newBookings = await this.bookingRepo.count({ where:{ status:'confirmed' } });
    const popular = await this.getPopularPrograms(1);
    return { newBookings, avgRating: popular.summary.overallAvgRating, popularProgram: popular.topEvents[0]?.title || '-' };
  }
}
