/**
 * CrmService — قلب سیستم CRM
 * وظایف:
 *  1. ثبت رویدادهای رفتاری کاربران
 *  2. تحلیل الگوها و تولید آمار
 *  3. ارسال داده به Claude AI و دریافت تحلیل
 *  4. تولید و مدیریت هشدارهای هوشمند
 *  5. Cron job روزانه برای بررسی سیستماتیک
 *
 * مسیر: src/modules/crm/crm.service.ts
 */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  UserBehaviorEvent,
  BehaviorEventType,
  EventSeverity,
} from './entities/user-behavior-event.entity';
import {
  CrmAiAlert,
  AlertType,
  AlertStatus,
  AlertSeverity,
} from './entities/crm-ai-alert.entity';

const AI_API_URL = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com/v1') + '/messages';
const AI_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// ── DTO داخلی برای ثبت رویداد ─────────────────────────────────
export interface TrackEventDto {
  userId?: string | null;
  eventType: BehaviorEventType;
  severity?: EventSeverity;
  pagePath?: string;
  apiEndpoint?: string;
  httpStatus?: number;
  responseTimeMs?: number;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  constructor(
    @InjectRepository(UserBehaviorEvent)
    private readonly behaviorRepo: Repository<UserBehaviorEvent>,
    @InjectRepository(CrmAiAlert)
    private readonly alertRepo: Repository<CrmAiAlert>,
  ) {}

  // ═══════════════════════════════════════════════════════════════
  // ۱. ثبت رویداد رفتاری
  // ═══════════════════════════════════════════════════════════════
  async track(dto: TrackEventDto): Promise<void> {
    try {
      const event = this.behaviorRepo.create({
        user_id:         dto.userId ?? null,
        event_type:      dto.eventType,
        severity:        dto.severity ?? EventSeverity.INFO,
        page_path:       dto.pagePath ?? null,
        api_endpoint:    dto.apiEndpoint ?? null,
        http_status:     dto.httpStatus ?? null,
        response_time_ms: dto.responseTimeMs ?? null,
        session_id:      dto.sessionId ?? null,
        ip_address:      dto.ipAddress ?? null,
        user_agent:      dto.userAgent ?? null,
        metadata:        dto.metadata ?? null,
      });
      await this.behaviorRepo.save(event);
    } catch (err) {
      // هرگز نباید به خاطر tracking، درخواست اصلی fail شود
      this.logger.error(`CRM track error: ${err.message}`);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ۲. آمار کلی برای داشبورد
  // ═══════════════════════════════════════════════════════════════
  async getDashboardStats(days = 7): Promise<any> {
    const since = new Date(Date.now() - days * 86400_000);

    const [
      totalEvents,
      errorEvents,
      uniqueSessions,
      openAlerts,
      criticalAlerts,
    ] = await Promise.all([
      this.behaviorRepo.count({ where: { created_at: MoreThan(since) } }),
      this.behaviorRepo.count({
        where: { severity: EventSeverity.ERROR, created_at: MoreThan(since) },
      }),
      this.behaviorRepo
        .createQueryBuilder('e')
        .select('COUNT(DISTINCT e.session_id)', 'cnt')
        .where('e.created_at > :since', { since })
        .getRawOne()
        .then(r => Number(r?.cnt || 0)),
      this.alertRepo.count({ where: { status: AlertStatus.OPEN } }),
      this.alertRepo.count({
        where: { status: AlertStatus.OPEN, severity: AlertSeverity.CRITICAL },
      }),
    ]);

    // رویدادها بر اساس نوع
    const eventTypeBreakdown = await this.behaviorRepo
      .createQueryBuilder('e')
      .select('e.event_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('e.created_at > :since', { since })
      .groupBy('e.event_type')
      .orderBy('count', 'DESC')
      .getRawMany();

    // روند روزانه (۷ روز)
    const dailyTrend = await this.getDailyTrend(days);

    // میانگین زمان پاسخ API
    const avgResponseTime = await this.behaviorRepo
      .createQueryBuilder('e')
      .select('AVG(e.response_time_ms)', 'avg')
      .where('e.event_type = :t', { t: BehaviorEventType.API_CALL })
      .andWhere('e.created_at > :since', { since })
      .andWhere('e.response_time_ms IS NOT NULL')
      .getRawOne()
      .then(r => Math.round(Number(r?.avg || 0)));

    // نرخ خطا
    const errorRate = totalEvents > 0
      ? Math.round((errorEvents / totalEvents) * 100)
      : 0;

    // آخرین هشدارها
    const recentAlerts = await this.alertRepo.find({
      order: { created_at: 'DESC' },
      take: 5,
    });

    // فعال‌ترین endpoint ها
    const topEndpoints = await this.behaviorRepo
      .createQueryBuilder('e')
      .select('e.api_endpoint', 'endpoint')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(e.response_time_ms)', 'avg_ms')
      .where('e.event_type = :t', { t: BehaviorEventType.API_CALL })
      .andWhere('e.created_at > :since', { since })
      .andWhere('e.api_endpoint IS NOT NULL')
      .groupBy('e.api_endpoint')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // صفحات پربازدید
    const topPages = await this.behaviorRepo
      .createQueryBuilder('e')
      .select('e.page_path', 'path')
      .addSelect('COUNT(*)', 'count')
      .where('e.event_type = :t', { t: BehaviorEventType.PAGE_VIEW })
      .andWhere('e.created_at > :since', { since })
      .andWhere('e.page_path IS NOT NULL')
      .groupBy('e.page_path')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      summary: {
        totalEvents,
        errorEvents,
        errorRate,
        uniqueSessions,
        avgResponseTime,
        openAlerts,
        criticalAlerts,
      },
      eventTypeBreakdown,
      dailyTrend,
      topEndpoints,
      topPages,
      recentAlerts,
    };
  }

  // ── روند روزانه ─────────────────────────────────────────────────
  private async getDailyTrend(days: number) {
    const trend = [];
    for (let i = days - 1; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const [total, errors, bookings, payments] = await Promise.all([
        this.behaviorRepo.count({ where: { created_at: Between(start, end) } }),
        this.behaviorRepo.count({
          where: { severity: EventSeverity.ERROR, created_at: Between(start, end) },
        }),
        this.behaviorRepo.count({
          where: { event_type: BehaviorEventType.BOOKING_COMPLETE, created_at: Between(start, end) },
        }),
        this.behaviorRepo.count({
          where: { event_type: BehaviorEventType.PAYMENT_SUCCESS, created_at: Between(start, end) },
        }),
      ]);

      trend.push({
        date: start.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
        total,
        errors,
        bookings,
        payments,
      });
    }
    return trend;
  }

  // ═══════════════════════════════════════════════════════════════
  // ۳. تحلیل رفتار یک کاربر خاص
  // ═══════════════════════════════════════════════════════════════
  async getUserBehaviorSummary(userId: string, days = 30): Promise<any> {
    const since = new Date(Date.now() - days * 86400_000);

    const events = await this.behaviorRepo.find({
      where: { user_id: userId, created_at: MoreThan(since) },
      order: { created_at: 'DESC' },
    });

    const summary = {
      totalActions: events.length,
      pageViews:    events.filter(e => e.event_type === BehaviorEventType.PAGE_VIEW).length,
      bookingStarts:    events.filter(e => e.event_type === BehaviorEventType.BOOKING_START).length,
      bookingCompletes: events.filter(e => e.event_type === BehaviorEventType.BOOKING_COMPLETE).length,
      bookingAbandons:  events.filter(e => e.event_type === BehaviorEventType.BOOKING_ABANDON).length,
      paymentSuccesses: events.filter(e => e.event_type === BehaviorEventType.PAYMENT_SUCCESS).length,
      paymentFails:     events.filter(e => e.event_type === BehaviorEventType.PAYMENT_FAIL).length,
      errors:           events.filter(e => e.severity === EventSeverity.ERROR).length,
      lastActive:       events[0]?.created_at ?? null,
    };

    // نرخ تبدیل رزرو
    const conversionRate = summary.bookingStarts > 0
      ? Math.round((summary.bookingCompletes / summary.bookingStarts) * 100)
      : 0;

    // صفحات بیشتر بازدیدشده
    const pageCounts: Record<string, number> = {};
    events
      .filter(e => e.event_type === BehaviorEventType.PAGE_VIEW && e.page_path)
      .forEach(e => { pageCounts[e.page_path!] = (pageCounts[e.page_path!] || 0) + 1; });

    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }));

    return { summary, conversionRate, topPages, recentEvents: events.slice(0, 20) };
  }

  // ═══════════════════════════════════════════════════════════════
  // ۴. ارسال داده به Claude AI و تحلیل
  // ═══════════════════════════════════════════════════════════════
  async analyzeWithAI(windowHours = 24): Promise<CrmAiAlert | null> {
    const since = new Date(Date.now() - windowHours * 3600_000);

    // جمع‌آوری داده‌های خام
    const [
      totalEvents,
      errorEvents,
      paymentFails,
      bookingAbandons,
      apiErrors,
    ] = await Promise.all([
      this.behaviorRepo.count({ where: { created_at: MoreThan(since) } }),
      this.behaviorRepo.count({ where: { severity: EventSeverity.ERROR, created_at: MoreThan(since) } }),
      this.behaviorRepo.count({ where: { event_type: BehaviorEventType.PAYMENT_FAIL, created_at: MoreThan(since) } }),
      this.behaviorRepo.count({ where: { event_type: BehaviorEventType.BOOKING_ABANDON, created_at: MoreThan(since) } }),
      this.behaviorRepo.count({ where: { event_type: BehaviorEventType.API_ERROR, created_at: MoreThan(since) } }),
    ]);

    const slowApis = await this.behaviorRepo
      .createQueryBuilder('e')
      .select('e.api_endpoint', 'endpoint')
      .addSelect('AVG(e.response_time_ms)', 'avg_ms')
      .addSelect('COUNT(*)', 'count')
      .where('e.event_type = :t', { t: BehaviorEventType.API_CALL })
      .andWhere('e.created_at > :since', { since })
      .andWhere('e.response_time_ms > 2000')
      .groupBy('e.api_endpoint')
      .orderBy('avg_ms', 'DESC')
      .limit(5)
      .getRawMany();

    const errorRate = totalEvents > 0
      ? ((errorEvents / totalEvents) * 100).toFixed(1)
      : '0';

    const rawData = {
      window_hours: windowHours,
      total_events: totalEvents,
      error_events: errorEvents,
      error_rate_percent: errorRate,
      payment_fails: paymentFails,
      booking_abandons: bookingAbandons,
      api_errors: apiErrors,
      slow_apis: slowApis,
    };

    if (!AI_API_KEY) {
      this.logger.warn('ANTHROPIC_API_KEY تنظیم نشده — تحلیل AI انجام نمی‌شود');
      return null;
    }

    const prompt = `
تو یک تحلیلگر CRM برای پلتفرم رویداد اجتماعی «راوی» هستی.
داده‌های زیر رفتار کاربران در ${windowHours} ساعت گذشته را نشان می‌دهد:

${JSON.stringify(rawData, null, 2)}

وظیفه:
1. آیا وضعیت نرمال است یا مشکلی وجود دارد؟
2. مهم‌ترین ناهنجاری‌ها را شناسایی کن
3. علت احتمالی را توضیح بده
4. اقدام پیشنهادی برای تیم فنی بده
5. سطح خطر را تعیین کن: low / medium / high / critical

پاسخ فقط در قالب JSON:
{
  "is_ok": boolean,
  "alert_type": "anomaly|churn_risk|payment_issue|high_error_rate|booking_drop|suspicious|performance|engagement_low|positive_trend",
  "severity": "low|medium|high|critical",
  "title": "عنوان کوتاه فارسی",
  "analysis": "تحلیل کامل فارسی",
  "recommendation": "اقدام پیشنهادی فارسی",
  "risk_score": 0-100
}
`.trim();

    try {
      const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
          max_tokens: 800,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json() as any;
      const text = data.content?.[0]?.text || '{}';
      const clean = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(clean);

      // اگر AI گفت همه‌چیز OK است و خطر پایین — هشدار ثبت نکن
      if (result.is_ok && result.risk_score < 20) {
        this.logger.log(`✅ AI تحلیل: وضعیت نرمال (risk: ${result.risk_score})`);
        return null;
      }

      const alert = this.alertRepo.create({
        alert_type:   result.alert_type as AlertType,
        severity:     result.severity as AlertSeverity,
        status:       AlertStatus.OPEN,
        title:        result.title,
        ai_analysis:  result.analysis,
        recommendation: result.recommendation,
        raw_data:     rawData,
        risk_score:   result.risk_score,
      });

      const saved = await this.alertRepo.save(alert);
      this.logger.warn(`🚨 هشدار جدید: ${saved.title} (${saved.severity})`);
      return saved;

    } catch (err) {
      this.logger.error(`AI analysis error: ${err.message}`);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ۵. Cron: بررسی خودکار هر ۶ ساعت
  // ═══════════════════════════════════════════════════════════════
  @Cron('0 */6 * * *')
  async scheduledAiCheck() {
    this.logger.log('🤖 شروع بررسی AI...');
    await this.analyzeWithAI(6);
    this.logger.log('✅ بررسی AI کامل شد');
  }

  // ── Cron: نظافت رویدادهای قدیمی‌تر از ۹۰ روز ─────────────────
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanOldEvents() {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 86400_000);
    const result = await this.behaviorRepo.delete({ created_at: LessThan(ninetyDaysAgo) });
    this.logger.log(`🧹 ${result.affected} رویداد قدیمی حذف شد`);
  }

  // ═══════════════════════════════════════════════════════════════
  // ۶. مدیریت هشدارها
  // ═══════════════════════════════════════════════════════════════
  async getAlerts(status?: AlertStatus, page = 1, limit = 20) {
    const where = status ? { status } : {};
    const [data, total] = await this.alertRepo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page };
  }

  async updateAlertStatus(
    id: string,
    status: AlertStatus,
    adminId: string,
    note?: string,
  ): Promise<CrmAiAlert> {
    const alert = await this.alertRepo.findOne({ where: { id } });
    if (!alert) throw new Error('هشدار یافت نشد');
    alert.status     = status;
    alert.reviewed_by = adminId;
    alert.reviewed_at = new Date();
    if (note) alert.admin_note = note;
    return this.alertRepo.save(alert);
  }

  // ── تحلیل کاربران در خطر ریزش ─────────────────────────────────
  async getChurnRiskUsers(): Promise<any[]> {
    // کاربرانی که در ۳۰ روز گذشته فعال بودند اما ۱۴ روز است فعال نیستند
    const fourteenDaysAgo = new Date(Date.now() - 14 * 86400_000);
    const thirtyDaysAgo   = new Date(Date.now() - 30 * 86400_000);

    const result = await this.behaviorRepo
      .createQueryBuilder('e')
      .select('e.user_id', 'user_id')
      .addSelect('MAX(e.created_at)', 'last_active')
      .addSelect('COUNT(*)', 'total_actions')
      .where('e.user_id IS NOT NULL')
      .andWhere('e.created_at > :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy('e.user_id')
      .having('MAX(e.created_at) < :fourteenDaysAgo', { fourteenDaysAgo })
      .orderBy('last_active', 'ASC')
      .limit(50)
      .getRawMany();

    return result;
  }

  // ── رویدادهای یک کاربر خاص (برای ادمین) ──────────────────────
  async getUserEvents(userId: string, page = 1, limit = 50) {
    const [data, total] = await this.behaviorRepo.findAndCount({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  // ── trigger تحلیل دستی توسط ادمین ────────────────────────────
  async triggerManualAnalysis(hours = 24) {
    return this.analyzeWithAI(hours);
  }
}
