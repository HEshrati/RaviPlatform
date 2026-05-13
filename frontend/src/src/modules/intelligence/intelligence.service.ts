import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Event } from '../events/entities/event.entity';

export interface MatchCandidate {
  userId: string;
  profile: Profile;
  smartProfile?: SmartProfile;
  bookingId: string;
  locationPreference: 'neighborhood' | 'city_wide';
  score?: number;
}

export interface MatchGroup {
  groupId: string;
  members: MatchCandidate[];
  avgScore: number;
  eventId: string;
}

@Injectable()
export class IntelligenceService {
  private readonly logger = new Logger(IntelligenceService.name);

  constructor(
    @InjectRepository(SmartProfile)
    private smartProfileRepo: Repository<SmartProfile>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
  ) {}

  // ── محاسبه امتیاز مچینگ بین دو کاربر ─────────────────────────
  calculateMatchScore(
    candidateA: MatchCandidate,
    candidateB: MatchCandidate,
  ): number {
    let score = 100;
    const profileA = candidateA.profile;
    const profileB = candidateB.profile;
    const smartA = candidateA.smartProfile;
    const smartB = candidateB.smartProfile;

    // ── سن (اجباری: حداکثر 5 سال اختلاف) ─────────────────────
    if (profileA.age && profileB.age) {
      const ageDiff = Math.abs(profileA.age - profileB.age);
      if (ageDiff > 5) return 0; // حذف از پول
      score -= ageDiff * 5; // هر سال اختلاف = 5 امتیاز کمتر
    }

    // ── لوکیشن ─────────────────────────────────────────────────
    if (profileA.city && profileB.city && profileA.city === profileB.city) {
      score += 10;
    }
    // محله مشابه
    if (
      smartA?.preferred_neighborhood &&
      smartB?.preferred_neighborhood &&
      smartA.preferred_neighborhood === smartB.preferred_neighborhood
    ) {
      score += 15;
    }

    // ── تنوع شخصیتی (اجباری: ترکیب درون‌گرا + برون‌گرا) ───────
    // این در validate_group بررسی می‌شود

    // ── سطح انرژی ───────────────────────────────────────────────
    if (smartA && smartB) {
      const energyDiff = Math.abs(smartA.energy_level - smartB.energy_level);
      score -= energyDiff * 0.3;
    }

    // ── ریتم تعامل مکمل ─────────────────────────────────────────
    if (smartA?.interaction_rhythm && smartB?.interaction_rhythm) {
      if (
        (smartA.interaction_rhythm === 'active' && smartB.interaction_rhythm !== 'active') ||
        (smartB.interaction_rhythm === 'active' && smartA.interaction_rhythm !== 'active')
      ) {
        score += 5; // تعادل انرژی
      }
    }

    // ── نرخ بازگشت (کاربران وفادار با هم) ──────────────────────
    if (smartA && smartB) {
      if (smartA.return_rate > 0.5 && smartB.return_rate > 0.5) {
        score += 10;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  // ── اعتبارسنجی گروه: قوانین اجباری ──────────────────────────
  validateGroup(group: MatchCandidate[]): { valid: boolean; reason?: string } {
    // تعادل جنسیتی (به غیر از نشست‌های مخصوص بانوان)
    const females = group.filter((c) => c.profile?.gender === 'female').length;
    if (females === 0) {
      return { valid: false, reason: 'حداقل یک خانم باید در گروه باشد' };
    }

    // تنوع شخصیتی: حداقل یک درون‌گرا و یک برون‌گرا
    const extroverts = group.filter(
      (c) => c.smartProfile?.communication_type === 'extrovert',
    ).length;
    const introverts = group.filter(
      (c) => c.smartProfile?.communication_type === 'introvert',
    ).length;

    if (extroverts === 0 || introverts === 0) {
      // فقط warning، نه block (اگر داده کافی نداشته باشیم)
      this.logger.warn('گروه فاقد تنوع شخصیتی است');
    }

    // بررسی سن همه اعضا با هم (حداکثر 5 سال اختلاف)
    const ages = group
      .map((c) => c.profile?.age)
      .filter((a) => a != null) as number[];
    if (ages.length > 1) {
      const maxAge = Math.max(...ages);
      const minAge = Math.min(...ages);
      if (maxAge - minAge > 5) {
        return { valid: false, reason: 'اختلاف سنی بیش از ۵ سال' };
      }
    }

    return { valid: true };
  }

  // ── الگوریتم اصلی گروه‌بندی هوشمند ─────────────────────────
  async matchUsersForEvent(eventId: string): Promise<MatchGroup[]> {
    this.logger.log(`شروع مچینگ برای رویداد ${eventId}`);

    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new Error('رویداد یافت نشد');

    // دریافت تمام رزروهای پرداخت‌شده
    const bookings = await this.bookingRepo.find({
      where: { event_id: eventId, payment_status: 'paid' },
    });

    if (bookings.length < (event.min_group_size || 3)) {
      this.logger.warn(`تعداد رزرو کافی نیست: ${bookings.length}`);
      return [];
    }

    // جمع‌آوری اطلاعات کامل کاربران
    const candidates: MatchCandidate[] = await Promise.all(
      bookings.map(async (b) => {
        const [profile, smartProfile] = await Promise.all([
          this.profileRepo.findOne({ where: { user_id: b.user_id } }),
          this.smartProfileRepo.findOne({ where: { user_id: b.user_id } }),
        ]);

        // اولویت لوکیشن از metadata رزرو
        const locationPref =
          (b.metadata as any)?.locationPreference || 'city_wide';

        return {
          userId: b.user_id,
          profile: profile!,
          smartProfile: smartProfile || undefined,
          bookingId: b.id,
          locationPreference: locationPref,
        } as MatchCandidate;
      }),
    );

    // حذف کاربران ساسپند یا بدون پروفایل
    const validCandidates = candidates.filter(
      (c) => c.profile && !c.smartProfile?.is_suspended,
    );

    // ── الگوریتم گروه‌بندی: Greedy Matching ─────────────────────
    const groups: MatchGroup[] = [];
    const assigned = new Set<string>();
    const groupSize = event.max_group_size || 6;
    const minSize = event.min_group_size || 3;

    // مرتب‌سازی بر اساس اولویت لوکیشن (محله مشابه اول)
    const sortedCandidates = [...validCandidates].sort((a, b) => {
      if (a.locationPreference === 'neighborhood' && b.locationPreference !== 'neighborhood') return -1;
      if (b.locationPreference === 'neighborhood' && a.locationPreference !== 'neighborhood') return 1;
      return 0;
    });

    // گروه‌بندی
    for (const seed of sortedCandidates) {
      if (assigned.has(seed.userId)) continue;

      const group: MatchCandidate[] = [seed];
      assigned.add(seed.userId);

      // پیدا کردن بهترین مچ‌ها برای این seed
      const remaining = sortedCandidates.filter(
        (c) => !assigned.has(c.userId),
      );

      // محاسبه امتیاز همه با seed
      const scored = remaining.map((c) => ({
        candidate: c,
        score: this.calculateMatchScore(seed, c),
      }));

      // مرتب‌سازی نزولی بر اساس امتیاز
      scored.sort((a, b) => b.score - a.score);

      // اضافه کردن بهترین مچ‌ها
      for (const { candidate, score } of scored) {
        if (group.length >= groupSize) break;
        if (score === 0) continue; // اختلاف سنی بیش از ۵ سال

        // اضافه کردن موقت و اعتبارسنجی
        const testGroup = [...group, candidate];
        const validation = this.validateGroup(testGroup);

        if (validation.valid || testGroup.length < minSize) {
          group.push(candidate);
          assigned.add(candidate.userId);
        }
      }

      if (group.length >= minSize) {
        const avgScore =
          group.reduce((sum, c) => {
            const scores = group
              .filter((x) => x.userId !== c.userId)
              .map((x) => this.calculateMatchScore(c, x));
            return sum + (scores.reduce((s, v) => s + v, 0) / Math.max(scores.length, 1));
          }, 0) / group.length;

        groups.push({
          groupId: `${eventId}-group-${groups.length + 1}`,
          members: group,
          avgScore,
          eventId,
        });
      }
    }

    // ادغام گروه‌های کوچک (کمتر از minSize)
    if (assigned.size < validCandidates.length) {
      const unassigned = validCandidates.filter((c) => !assigned.has(c.userId));
      if (unassigned.length > 0 && groups.length > 0) {
        // اضافه کردن به گروه‌های موجود
        this.logger.log(
          `ادغام ${unassigned.length} کاربر بدون گروه با گروه‌های موجود`,
        );
        for (const c of unassigned) {
          // پیدا کردن گروه با کمترین اعضا
          const targetGroup = groups.sort(
            (a, b) => a.members.length - b.members.length,
          )[0];
          if (targetGroup.members.length < groupSize) {
            targetGroup.members.push(c);
          }
        }
      }
    }

    this.logger.log(
      `مچینگ کامل شد: ${groups.length} گروه برای ${validCandidates.length} کاربر`,
    );
    return groups;
  }

  // ── بروزرسانی پروفایل هوشمند بعد از رویداد ──────────────────
  async updateSmartProfileAfterEvent(
    userId: string,
    eventId: string,
    attended: boolean,
    feedbackScore?: number,
  ): Promise<void> {
    let smartProfile = await this.smartProfileRepo.findOne({
      where: { user_id: userId },
    });

    if (!smartProfile) {
      smartProfile = this.smartProfileRepo.create({ user_id: userId });
    }

    if (attended) {
      smartProfile.total_events_attended += 1;
      smartProfile.total_events_booked += 1;
    } else {
      smartProfile.no_show_count += 1;
      smartProfile.total_events_booked += 1;

      // ساسپند بعد از ۲ بار عدم حضور
      if (smartProfile.no_show_count >= 2 && !smartProfile.is_suspended) {
        smartProfile.is_suspended = true;
        smartProfile.suspension_reason =
          'دو بار ثبت‌نام و عدم حضور در رویداد';
        smartProfile.suspended_at = new Date();
        this.logger.warn(
          `کاربر ${userId} به دلیل عدم حضور ساسپند شد`,
        );
      }
    }

    // محاسبه نرخ بازگشت
    if (smartProfile.total_events_booked > 0) {
      smartProfile.return_rate =
        smartProfile.total_events_attended / smartProfile.total_events_booked;
    }

    smartProfile.last_ai_update = new Date();
    await this.smartProfileRepo.save(smartProfile);
  }

  // ── تحلیل رفتار کاربر در تلگرام ─────────────────────────────
  async updateTelegramBehavior(
    userId: string,
    behaviorData: {
      messageCount: number;
      isInitiator: boolean;
      isBridge: boolean;
      avgResponseTime: number;
    },
  ): Promise<void> {
    let smartProfile = await this.smartProfileRepo.findOne({
      where: { user_id: userId },
    });

    if (!smartProfile) {
      smartProfile = this.smartProfileRepo.create({ user_id: userId });
    }

    smartProfile.telegram_behavior = {
      avg_messages_per_event: behaviorData.messageCount,
      is_initiator: behaviorData.isInitiator,
      is_bridge: behaviorData.isBridge,
      response_time_avg: behaviorData.avgResponseTime,
      last_group_activity: new Date().toISOString(),
    };

    // استنتاج ریتم تعامل از رفتار تلگرام
    if (behaviorData.messageCount > 10 || behaviorData.isInitiator) {
      smartProfile.interaction_rhythm = 'active' as any;
      smartProfile.energy_level = Math.min(100, smartProfile.energy_level + 10);
    } else if (behaviorData.messageCount < 3) {
      smartProfile.interaction_rhythm = 'observer' as any;
      smartProfile.energy_level = Math.max(0, smartProfile.energy_level - 10);
    } else {
      smartProfile.interaction_rhythm = 'cautious' as any;
    }

    smartProfile.last_ai_update = new Date();
    await this.smartProfileRepo.save(smartProfile);
  }

  // ── شناسایی نیاز کاربر از گفتگوی تلگرام ────────────────────
  async detectUserNeedsFromKeywords(
    userId: string,
    keywords: string[],
  ): Promise<void> {
    let smartProfile = await this.smartProfileRepo.findOne({
      where: { user_id: userId },
    });

    if (!smartProfile) {
      smartProfile = this.smartProfileRepo.create({ user_id: userId });
    }

    const currentInterests = smartProfile.next_event_interests || [];
    const newInterests = keywords.filter(
      (k) => !currentInterests.includes(k),
    );
    smartProfile.next_event_interests = [
      ...currentInterests,
      ...newInterests,
    ].slice(0, 10); // max 10

    await this.smartProfileRepo.save(smartProfile);
  }

  // ── آمار هوشمند برای CEO Dashboard ──────────────────────────
  async getIntelligenceStats(): Promise<any> {
    const [totalProfiles, suspendedProfiles] = await Promise.all([
      this.smartProfileRepo.count(),
      this.smartProfileRepo.count({ where: { is_suspended: true } }),
    ]);

    const profiles = await this.smartProfileRepo.find();

    const communicationDist = {
      introvert: profiles.filter((p) => p.communication_type === 'introvert').length,
      extrovert: profiles.filter((p) => p.communication_type === 'extrovert').length,
      ambivert: profiles.filter((p) => p.communication_type === 'ambivert').length,
    };

    const avgReturnRate =
      profiles.length > 0
        ? profiles.reduce((s, p) => s + (p.return_rate || 0), 0) / profiles.length
        : 0;

    // پرتقاضاترین نیازها
    const allInterests = profiles.flatMap((p) => p.next_event_interests || []);
    const interestCount: Record<string, number> = {};
    for (const i of allInterests) {
      interestCount[i] = (interestCount[i] || 0) + 1;
    }
    const topInterests = Object.entries(interestCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([interest, count]) => ({ interest, count }));

    return {
      totalProfiles,
      suspendedProfiles,
      communicationDist,
      avgReturnRate: Math.round(avgReturnRate * 100),
      topInterests,
    };
  }
}
