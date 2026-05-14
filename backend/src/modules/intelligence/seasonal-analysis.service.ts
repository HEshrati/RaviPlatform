/**
 * سرویس تحلیل فصلی — لایه ۷ تحلیل رفتاری
 * بهترین ساعت‌های برگزاری در هر فصل تحلیل می‌شود
 */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Event }   from '../events/entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';

export type Season = 'spring' | 'summer' | 'fall' | 'winter';
const SEASON_LABELS: Record<Season, string>           = { spring:'بهار', summer:'تابستان', fall:'پاییز', winter:'زمستان' };
const SEASON_MONTHS: Record<Season, [number,number]>  = { spring:[3,5], summer:[6,8], fall:[9,11], winter:[12,2] };

@Injectable()
export class SeasonalAnalysisService {
  private readonly logger = new Logger(SeasonalAnalysisService.name);

  constructor(
    @InjectRepository(Event)   private eventRepo:   Repository<Event>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
  ) {}

  @Cron('0 0 21 3,6,9,12 *')
  async runSeasonalAnalysis() {
    const { season, year } = this.getLastSeason();
    this.logger.log(`��� تحلیل فصل ${SEASON_LABELS[season]} ${year}...`);
    return this.analyzeSeasonalTimeslots(season, year);
  }

  getCurrentSeason(): { season: Season; year: number } {
    const m = new Date().getMonth() + 1;
    const season: Season = m>=3&&m<=5?'spring': m>=6&&m<=8?'summer': m>=9&&m<=11?'fall':'winter';
    return { season, year: new Date().getFullYear() };
  }

  getLastSeason(): { season: Season; year: number } {
    const order: Season[] = ['spring','summer','fall','winter'];
    const { season, year } = this.getCurrentSeason();
    const idx = order.indexOf(season);
    const last = order[idx === 0 ? 3 : idx - 1];
    return { season: last, year: last === 'winter' && season === 'spring' ? year - 1 : year };
  }

  async analyzeCurrentSeason() {
    const { season, year } = this.getCurrentSeason();
    return this.analyzeSeasonalTimeslots(season, year);
  }

  async compareSeasons(year: number) {
    return Promise.all((['spring','summer','fall','winter'] as Season[]).map(s => this.analyzeSeasonalTimeslots(s, year)));
  }

  async analyzeSeasonalTimeslots(season: Season, year: number) {
    const [sm, em] = SEASON_MONTHS[season];
    const startDate = new Date(year, sm - 1, 1);
    const endDate   = sm > em ? new Date(year, 11, 31, 23, 59, 59) : new Date(year, em, 0, 23, 59, 59);

    const events = await this.eventRepo.find({
      where: { start_date: Between(startDate, endDate), is_active: true },
      relations: ['bookings'],
    });

    if (!events.length) return {
      season, seasonLabel: SEASON_LABELS[season], year, totalEvents: 0,
      bestTimeSlots: [], bestDays: [], insights: ['داده کافی وجود ندارد'],
    };

    const dayNames = ['یک‌شنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنج‌شنبه','جمعه','شنبه'];
    const hourStats: Record<number, { count:number; attended:number; total:number }> = {};
    const dayStats : Record<string, { count:number; attended:number; total:number }> = {};

    for (const ev of events) {
      const d = new Date(ev.start_date);
      const h = d.getHours();
      const day = dayNames[d.getDay()];
      const attended = ev.bookings?.filter(b => b.attended).length || 0;
      const total    = ev.bookings?.length || 0;
      if (!hourStats[h]) hourStats[h] = { count:0, attended:0, total:0 };
      hourStats[h].count++; hourStats[h].attended += attended; hourStats[h].total += total;
      if (!dayStats[day]) dayStats[day] = { count:0, attended:0, total:0 };
      dayStats[day].count++; dayStats[day].attended += attended; dayStats[day].total += total;
    }

    const bestTimeSlots = Object.entries(hourStats)
      .map(([h, s]) => ({ hour:+h, label:`${h}:00 - ${+h+2}:00`, eventCount:s.count,
        successRate: s.total ? Math.round(s.attended/s.total*100) : 0 }))
      .sort((a,b) => b.successRate - a.successRate).slice(0,5);

    const bestDays = Object.entries(dayStats)
      .map(([day, s]) => ({ day, count:s.count, successRate: s.total ? Math.round(s.attended/s.total*100) : 0 }))
      .sort((a,b) => b.successRate - a.successRate);

    const insights: string[] = [];
    if (bestTimeSlots[0]) insights.push(`بهترین ساعت: ${bestTimeSlots[0].label} (${bestTimeSlots[0].successRate}%)`);
    if (bestDays[0]) insights.push(`پرطرفدارترین روز: ${bestDays[0].day} با ${bestDays[0].count} ایونت`);
    insights.push(`مجموع ${events.length} ایونت در ${SEASON_LABELS[season]} ${year}`);

    return { season, seasonLabel: SEASON_LABELS[season], year, totalEvents: events.length, bestTimeSlots, bestDays, insights };
  }
}
