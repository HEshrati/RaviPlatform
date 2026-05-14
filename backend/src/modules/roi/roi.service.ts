import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';

@Injectable()
export class RoiService {
  private readonly logger = new Logger(RoiService.name);

  constructor(
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Feedback) private feedbackRepo: Repository<Feedback>,
    @InjectRepository(SmartProfile) private spRepo: Repository<SmartProfile>,
  ) {}

  async getEventROI(eventId: string) {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new Error('رویداد یافت نشد');
    const bookings = await this.bookingRepo.find({ where: { event_id: eventId } });
    const paid = bookings.filter(b => b.payment_status === 'paid');
    const attended = paid.filter(b => b.attended);
    const totalRevenue = paid.reduce((s, b) => s + Number(b.amount_paid || (event as any).price || 0), 0);
    const venueCost = Number((event as any).venue_cost || 0);
    const netProfit = totalRevenue - venueCost;
    const roiPercent = venueCost > 0 ? Math.round((netProfit / venueCost) * 100) : 100;
    const feedbacks = await this.feedbackRepo.find({ where: { event_id: eventId } });
    const avgFeedbackScore = feedbacks.length > 0 ? Math.round(feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.length * 10) / 10 : 0;
    let returnCount = 0;
    for (const b of attended) {
      const c = await this.bookingRepo.count({ where: { user_id: b.user_id } });
      if (c > 1) returnCount++;
    }
    const attendanceRate = paid.length > 0 ? Math.round((attended.length / paid.length) * 100) : 0;
    const returnRate = attended.length > 0 ? Math.round((returnCount / attended.length) * 100) : 0;
    const successScore = Math.round(attendanceRate * 0.4 + (avgFeedbackScore / 5 * 100) * 0.3 + returnRate * 0.2 + Math.min(Math.max(roiPercent, 0), 100) * 0.1);
    return { eventId, title: event.title, date: new Date(event.start_date).toLocaleDateString('fa-IR'), totalRevenue, venueCost, netProfit, roiPercent, totalBooked: paid.length, totalAttended: attended.length, attendanceRate, avgFeedbackScore, returnRate, successScore };
  }

  async getMonthlyROI(months = 3) {
    const now = new Date();
    const monthly = [];
    for (let i = months - 1; i >= 0; i--) {
      const s = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const e = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const events = await this.eventRepo.find({ where: { start_date: Between(s, e), is_active: true } });
      let revenue = 0, cost = 0, scores: number[] = [], att: number[] = [];
      for (const ev of events) {
        try { const r = await this.getEventROI(ev.id); revenue += r.totalRevenue; cost += r.venueCost; scores.push(r.successScore); att.push(r.attendanceRate); } catch {}
      }
      monthly.push({ label: s.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' }), revenue, cost, profit: revenue - cost, avgSuccessScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0, eventCount: events.length, attendanceRate: att.length > 0 ? Math.round(att.reduce((a, b) => a + b, 0) / att.length) : 0 });
    }
    const tot = monthly.reduce((a, m) => ({ r: a.r + m.revenue, c: a.c + m.cost, p: a.p + m.profit, s: a.s + m.avgSuccessScore }), { r: 0, c: 0, p: 0, s: 0 });
    const profiles = await this.spRepo.find({ take: 500 });
    const avgReturnRate = profiles.length > 0 ? Math.round(profiles.reduce((s, p) => s + (p.return_rate || 0), 0) / profiles.length * 100) : 0;
    return { monthly, summary: { totalRevenue: tot.r, totalCost: tot.c, totalProfit: tot.p, avgSuccessScore: months > 0 ? Math.round(tot.s / months) : 0, avgReturnRate } };
  }

  async analyzeEventWithAI(eventId: string) {
    const roi = await this.getEventROI(eventId);
    const bookings = await this.bookingRepo.find({ where: { event_id: eventId, payment_status: 'paid' } });
    const absentIds: string[] = [];
    for (const b of bookings.filter(x => !x.attended)) {
      const c = await this.bookingRepo.count({ where: { user_id: b.user_id, payment_status: 'paid', attended: false } });
      if (c >= 2) absentIds.push(b.user_id);
    }
    let insight = '';
    const recs: string[] = [];
    if (roi.successScore >= 80) { insight = `همنشینی "${roi.title}" با موفقیت بالا برگزار شد (حضور ${roi.attendanceRate}%, بازخورد ${roi.avgFeedbackScore}/5).`; recs.push('برنامه‌ریزی رویداد مشابه توصیه می‌شود.'); }
    else if (roi.successScore >= 60) { insight = `همنشینی "${roi.title}" عملکرد متوسطی داشت.`; recs.push('بررسی علت غیبت با ارسال نظرسنجی پیشنهاد می‌شود.'); }
    else { insight = `همنشینی "${roi.title}" نیاز به بازبینی دارد (حضور ${roi.attendanceRate}%).`; recs.push('بازنگری در زمان‌بندی یا مکان ضروری است.'); }
    if (roi.roiPercent < 0) recs.push('هزینه کافه بیشتر از درآمد است — مذاکره برای تخفیف توصیه می‌شود.');
    if (roi.returnRate < 30) recs.push('نرخ بازگشت کاربران پایین است — ارسال پیشنهاد ویژه توصیه می‌شود.');
    return { roi, aiInsight: insight, recommendations: recs, bannedUsers: absentIds };
  }
}
