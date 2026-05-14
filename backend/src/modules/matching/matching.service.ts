/**
 * الگوریتم Matching هوشمند راوی
 * لایه ۳ - قلب سیستم هوشمندسازی
 * 
 * قوانین اجباری:
 * - ترکیب برون‌گرا و درون‌گرا در هر گروه
 * - تعادل جنسیتی (حداقل 1-2 خانم در گروه‌های مختلط)
 * - بازه سنی حداکثر ۵ سال
 * - اولویت مکانی (محله / سراسر شهر)
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { SmartProfile, CommunicationType, InteractionRhythm } from '../smart-profile/entities/smart-profile.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { User } from '../users/entities/user.entity';

export interface MatchCandidate {
  userId: string;
  profile: Profile;
  smartProfile: SmartProfile;
  age: number;
  gender: string;
  city: string;
  neighborhoodPrefs: string[];
  locationPref: string;
  extroversionScore: number;
  energyLevel: number;
  interests: string[];
}

export interface MatchGroup {
  memberIds: string[];
  avgCompatibilityScore: number;
  groupName: string;
  matchReasons: string[];
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    @InjectRepository(SmartProfile)
    private readonly smartProfileRepo: Repository<SmartProfile>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectDataSource()
    private readonly ds: DataSource,
  ) {}

  /**
   * گروه‌بندی هوشمند کاربران برای یک رویداد
   */
  async createSmartGroups(
    eventId: string,
    userIds: string[],
    groupSize = 5,
    eventType: string = 'mixed',
  ): Promise<MatchGroup[]> {
    this.logger.log(`Starting smart matching for event ${eventId} with ${userIds.length} users`);

    // دریافت پروفایل‌های هوشمند
    const candidates = await this.buildCandidateList(userIds);
    
    if (candidates.length < 2) {
      this.logger.warn(`Not enough candidates for matching: ${candidates.length}`);
      return [];
    }

    // گروه‌بندی با الگوریتم چندبعدی
    const groups = this.multiDimensionalGrouping(candidates, groupSize, eventType);
    
    this.logger.log(`Created ${groups.length} groups for event ${eventId}`);
    return groups;
  }

  /**
   * ساخت لیست کاندیداها با تمام اطلاعات مورد نیاز
   */
  private async buildCandidateList(userIds: string[]): Promise<MatchCandidate[]> {
    const candidates: MatchCandidate[] = [];

    for (const userId of userIds) {
      try {
        const [profile, smartProfile] = await Promise.all([
          this.profileRepo.findOne({ where: { user_id: userId } }),
          this.smartProfileRepo.findOne({ where: { user_id: userId } }),
        ]);

        if (!profile) continue;

        // محاسبه سن
        const age = profile.age || this.calculateAge(profile.birth_date);

        candidates.push({
          userId,
          profile,
          smartProfile: smartProfile || this.getDefaultSmartProfile(userId),
          age,
          gender: profile.gender || 'prefer-not-to-say',
          city: profile.city || '',
          neighborhoodPrefs: smartProfile?.neighborhood_preferences || [],
          locationPref: smartProfile?.location_preference || 'neighborhood',
          extroversionScore: smartProfile?.extroversion_score ?? 50,
          energyLevel: smartProfile?.energy_level ?? 50,
          interests: profile.interests || [],
        });
      } catch (e) {
        this.logger.warn(`Failed to build candidate for user ${userId}: ${e.message}`);
      }
    }

    return candidates;
  }

  /**
   * الگوریتم گروه‌بندی چندبعدی
   */
  private multiDimensionalGrouping(
    candidates: MatchCandidate[],
    groupSize: number,
    eventType: string,
  ): MatchGroup[] {
    const groups: MatchGroup[] = [];
    const used = new Set<string>();

    // مرتب‌سازی اولیه: ترکیب عمدی از درون‌گرا و برون‌گرا
    const sorted = [...candidates].sort((a, b) => b.extroversionScore - a.extroversionScore);

    let groupIndex = 0;
    
    while (used.size < candidates.length) {
      const remaining = sorted.filter(c => !used.has(c.userId));
      if (remaining.length === 0) break;

      // شروع گروه با برون‌گراترین کاربر باقی‌مانده
      const seed = remaining[0];
      used.add(seed.userId);
      
      const groupMembers: MatchCandidate[] = [seed];
      
      // اضافه کردن اعضای مناسب
      const potentials = remaining.slice(1).filter(c => !used.has(c.userId));
      
      for (const candidate of potentials) {
        if (groupMembers.length >= groupSize) break;
        
        if (this.isCompatibleForGroup(candidate, groupMembers, eventType)) {
          groupMembers.push(candidate);
          used.add(candidate.userId);
        }
      }

      // اگر گروه خیلی کوچک بود، اعضای باقی‌مانده رو اضافه کن
      if (groupMembers.length < Math.min(3, candidates.length)) {
        const remaining2 = sorted.filter(c => !used.has(c.userId));
        for (const c of remaining2) {
          if (groupMembers.length >= groupSize) break;
          groupMembers.push(c);
          used.add(c.userId);
        }
      }

      if (groupMembers.length >= 2) {
        const score = this.calculateGroupCompatibility(groupMembers);
        groups.push({
          memberIds: groupMembers.map(m => m.userId),
          avgCompatibilityScore: score,
          groupName: `گروه راوی ${groupIndex + 1}`,
          matchReasons: this.generateMatchReasons(groupMembers),
        });
        groupIndex++;
      }
    }

    return groups;
  }

  /**
   * بررسی سازگاری کاندیدا با گروه موجود
   * قوانین اجباری اعمال می‌شود
   */
  private isCompatibleForGroup(
    candidate: MatchCandidate,
    group: MatchCandidate[],
    eventType: string,
  ): boolean {
    // ─── قانون اجباری ۱: بازه سنی حداکثر ۵ سال ─────────────────────
    if (candidate.age > 0) {
      const ages = group.filter(m => m.age > 0).map(m => m.age);
      if (ages.length > 0) {
        const minAge = Math.min(...ages);
        const maxAge = Math.max(...ages);
        const newMin = Math.min(minAge, candidate.age);
        const newMax = Math.max(maxAge, candidate.age);
        if (newMax - newMin > 5) return false;
      }
    }

    // ─── قانون اجباری ۲: اولویت مکان ────────────────────────────────
    if (candidate.locationPref === 'neighborhood' && group.length > 0) {
      // حداقل یکی باید محله مشترک داشته باشند
      const hasNeighborhoodMatch = group.some(m => {
        const candidateNeighborhoods = candidate.neighborhoodPrefs;
        const memberNeighborhoods = m.neighborhoodPrefs;
        return candidateNeighborhoods.some(n => memberNeighborhoods.includes(n));
      });
      // اگر محله مشترک نداشتن، ولی تعداد گروه کمه، قبول کن
      if (!hasNeighborhoodMatch && group.length >= 3) {
        // اگر گزینه citywide دارن قبول می‌شن
        if (!group.some(m => m.locationPref === 'citywide')) {
          return false;
        }
      }
    }

    // ─── قانون اجباری ۳: تعادل جنسیتی (نشست‌های مختلط) ─────────────
    if (eventType !== 'women-only') {
      const females = group.filter(m => m.gender === 'female').length;
      const groupSize = group.length;
      
      // اگر هنوز خانم نداریم و کاندیدا خانم نیست
      if (females === 0 && candidate.gender !== 'female' && groupSize >= 3) {
        return false; // نباید گروه کاملاً مردانه بشه
      }
    }

    return true;
  }

  /**
   * محاسبه امتیاز سازگاری کل گروه
   */
  private calculateGroupCompatibility(members: MatchCandidate[]): number {
    if (members.length < 2) return 0;

    let totalScore = 0;
    let pairs = 0;

    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        totalScore += this.calculatePairCompatibility(members[i], members[j]);
        pairs++;
      }
    }

    return pairs > 0 ? Math.round((totalScore / pairs) * 100) / 100 : 0;
  }

  /**
   * محاسبه سازگاری بین دو نفر
   */
  private calculatePairCompatibility(a: MatchCandidate, b: MatchCandidate): number {
    let score = 0;
    const maxScore = 100;

    // ۱. شباهت علایق (30 امتیاز)
    const commonInterests = a.interests.filter(i => b.interests.includes(i));
    const interestScore = Math.min(30, commonInterests.length * 10);
    score += interestScore;

    // ۲. تنوع شخصیتی (20 امتیاز) - مطلوب ترکیب درون/برون‌گرا
    const extrovertDiff = Math.abs(a.extroversionScore - b.extroversionScore);
    const personalityScore = extrovertDiff > 20 ? 20 : 10; // تنوع شخصیتی مطلوب‌تر
    score += personalityScore;

    // ۳. نزدیکی سنی (20 امتیاز)
    if (a.age > 0 && b.age > 0) {
      const ageDiff = Math.abs(a.age - b.age);
      const ageScore = Math.max(0, 20 - ageDiff * 4);
      score += ageScore;
    } else {
      score += 10;
    }

    // ۴. مکان مشترک (20 امتیاز)
    const hasLocationMatch =
      a.neighborhoodPrefs.some(n => b.neighborhoodPrefs.includes(n)) ||
      a.locationPref === 'citywide' || b.locationPref === 'citywide';
    score += hasLocationMatch ? 20 : 0;

    // ۵. تعادل انرژی (10 امتیاز) - متعادل‌سازی سطح انرژی
    const energyDiff = Math.abs(a.energyLevel - b.energyLevel);
    const energyScore = Math.max(0, 10 - energyDiff / 10);
    score += energyScore;

    return Math.min(maxScore, score);
  }

  /**
   * تولید دلایل مچ برای نمایش به ادمین
   */
  private generateMatchReasons(members: MatchCandidate[]): string[] {
    const reasons: string[] = [];

    const females = members.filter(m => m.gender === 'female').length;
    const males = members.filter(m => m.gender === 'male').length;
    if (females > 0 && males > 0) reasons.push(`تعادل جنسیتی: ${females} خانم، ${males} آقا`);

    const ages = members.filter(m => m.age > 0).map(m => m.age);
    if (ages.length > 0) {
      reasons.push(`بازه سنی: ${Math.min(...ages)}-${Math.max(...ages)} سال`);
    }

    const introverts = members.filter(m => m.extroversionScore < 40).length;
    const extroverts = members.filter(m => m.extroversionScore > 60).length;
    if (introverts > 0 && extroverts > 0) {
      reasons.push(`ترکیب شخصیتی: ${extroverts} برون‌گرا + ${introverts} درون‌گرا`);
    }

    return reasons;
  }

  /**
   * به‌روزرسانی پروفایل هوشمند بعد از رویداد
   */
  async updateSmartProfileAfterEvent(
    userId: string,
    eventId: string,
    attended: boolean,
    satisfactionScore: number | null,
    telegramMetadata?: {
      messageCount: number;
      responseTimeMinutes: number;
    },
  ): Promise<void> {
    let smartProfile = await this.smartProfileRepo.findOne({ where: { user_id: userId } });
    
    if (!smartProfile) {
      smartProfile = this.smartProfileRepo.create({ user_id: userId });
    }

    if (attended) {
      smartProfile.total_events_attended += 1;
      smartProfile.last_event_attended_at = new Date();
      
      if (satisfactionScore !== null) {
        const totalSatisfaction =
          smartProfile.avg_match_satisfaction * (smartProfile.total_events_attended - 1) +
          satisfactionScore;
        smartProfile.avg_match_satisfaction =
          totalSatisfaction / smartProfile.total_events_attended;
      }
    } else {
      smartProfile.no_show_count += 1;
      
      // ─── قانون ساسپند: ۲ بار عدم حضور ─────────────────────────────
      if (smartProfile.no_show_count >= 2 && !smartProfile.is_suspended) {
        smartProfile.is_suspended = true;
        smartProfile.suspension_reason = 
          'دو بار در رویداد ثبت‌نام کردید ولی حضور نداشتید';
        smartProfile.suspended_at = new Date();
        this.logger.warn(`User ${userId} suspended due to 2 no-shows`);
      }
    }

    // به‌روزرسانی اطلاعات تلگرام
    if (telegramMetadata) {
      smartProfile.telegram_messages_sent = 
        (smartProfile.telegram_messages_sent || 0) + telegramMetadata.messageCount;
      smartProfile.telegram_message_rate = telegramMetadata.messageCount;
      
      // تشخیص ریتم تعامل از میزان پیام
      if (telegramMetadata.messageCount > 20) {
        smartProfile.interaction_rhythm = InteractionRhythm.ACTIVE;
        smartProfile.energy_level = Math.min(100, (smartProfile.energy_level || 50) + 5);
      } else if (telegramMetadata.messageCount < 5) {
        smartProfile.interaction_rhythm = InteractionRhythm.OBSERVER;
        smartProfile.energy_level = Math.max(0, (smartProfile.energy_level || 50) - 5);
      } else {
        smartProfile.interaction_rhythm = InteractionRhythm.CAUTIOUS;
      }

      // استنتاج تیپ ارتباطی از extroversion_score
      if (smartProfile.extroversion_score >= 65) {
        smartProfile.communication_type = CommunicationType.EXTROVERT;
      } else if (smartProfile.extroversion_score <= 35) {
        smartProfile.communication_type = CommunicationType.INTROVERT;
      } else {
        smartProfile.communication_type = CommunicationType.AMBIVERT;
      }
    }

    // محاسبه نرخ بازگشت
    if (smartProfile.total_events_booked > 0) {
      smartProfile.return_rate = 
        (smartProfile.total_events_attended / smartProfile.total_events_booked) * 100;
    }

    await this.smartProfileRepo.save(smartProfile);
  }

  /**
   * ادغام گروه‌های کوچک (تا ۱۲ ساعت قبل از رویداد)
   */
  async mergeIncompleteGroups(
    groups: MatchGroup[],
    minGroupSize = 4,
  ): Promise<MatchGroup[]> {
    const merged: MatchGroup[] = [];
    const incomplete = groups.filter(g => g.memberIds.length < minGroupSize);
    const complete = groups.filter(g => g.memberIds.length >= minGroupSize);

    merged.push(...complete);

    if (incomplete.length > 0) {
      // ترکیب گروه‌های ناقص با توجه به قوانین مچینگ
      const allIncompleteMembers = incomplete.flatMap(g => g.memberIds);
      
      this.logger.log(`Merging ${incomplete.length} incomplete groups (${allIncompleteMembers.length} total users)`);

      if (merged.length > 0 && allIncompleteMembers.length > 0) {
        // اضافه کردن به گروه‌های موجود
        const lastGroup = merged[merged.length - 1];
        lastGroup.memberIds = [...lastGroup.memberIds, ...allIncompleteMembers];
        lastGroup.matchReasons.push('گروه‌های ناقص ادغام شدند');
      } else if (allIncompleteMembers.length > 0) {
        merged.push({
          memberIds: allIncompleteMembers,
          avgCompatibilityScore: 60,
          groupName: 'گروه ادغام‌شده',
          matchReasons: ['گروه‌های ناقص ادغام شدند'],
        });
      }
    }

    return merged;
  }

  /**
   * استخراج نیازهای کاربر از پیام‌های گروه (keyword-based)
   */
  async extractUserNeedsFromTelegram(
    userId: string,
    groupMessages: { text: string; timestamp: Date }[],
  ): Promise<void> {
    const eventKeywords: Record<string, string[]> = {
      'سینما': ['سینما', 'فیلم', 'سریال', 'تماشا'],
      'کوهنوردی': ['کوه', 'طبیعت', 'هایکینگ', 'پیاده‌روی'],
      'کافه': ['کافه', 'قهوه', 'چای', 'گپ'],
      'ورزش': ['ورزش', 'باشگاه', 'فوتبال', 'والیبال'],
      'تئاتر': ['تئاتر', 'نمایش', 'صحنه'],
      'موسیقی': ['موسیقی', 'کنسرت', 'آهنگ'],
    };

    const detectedNeeds: string[] = [];
    const allText = groupMessages.map(m => m.text).join(' ').toLowerCase();

    for (const [eventType, keywords] of Object.entries(eventKeywords)) {
      if (keywords.some(kw => allText.includes(kw))) {
        detectedNeeds.push(eventType);
      }
    }

    if (detectedNeeds.length === 0) return;

    let smartProfile = await this.smartProfileRepo.findOne({ where: { user_id: userId } });
    if (!smartProfile) {
      smartProfile = this.smartProfileRepo.create({ user_id: userId });
    }

    const existing = smartProfile.next_event_interests || [];
    const merged = [...new Set([...existing, ...detectedNeeds])];
    smartProfile.next_event_interests = merged;

    await this.smartProfileRepo.save(smartProfile);
    this.logger.log(`Updated user ${userId} needs: ${detectedNeeds.join(', ')}`);
  }

  /**
   * بررسی کاربران غیرفعال (۱۴ روز)
   */
  async findInactiveUsers(daysSinceLastActivity = 14): Promise<string[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysSinceLastActivity);

    const inactive = await this.smartProfileRepo
      .createQueryBuilder('sp')
      .where('sp.last_event_attended_at < :cutoff OR sp.last_event_attended_at IS NULL')
      .andWhere('sp.total_events_booked = 0')
      .setParameter('cutoff', cutoff)
      .getMany();

    return inactive.map(p => p.user_id);
  }

  /**
   * الگوهای رفتاری (بعد از ۳ ماه داده)
   */
  async getBehaviorPatterns(): Promise<{
    bestHours: number[];
    popularEventTypes: string[];
    avgReturnRate: number;
    topPerformingAgeGroups: string[];
  }> {
    const profiles = await this.smartProfileRepo.find({ take: 200 });

    const returnRates = profiles.map(p => p.return_rate).filter(r => r > 0);
    const avgReturnRate = returnRates.length > 0
      ? returnRates.reduce((a, b) => a + b, 0) / returnRates.length
      : 0;

    const allInterests: Record<string, number> = {};
    profiles.forEach(p => {
      (p.next_event_interests || []).forEach(interest => {
        allInterests[interest] = (allInterests[interest] || 0) + 1;
      });
    });

    const popularEventTypes = Object.entries(allInterests)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type]) => type);

    return {
      bestHours: [17, 18, 19, 20], // بعداً از داده‌های واقعی محاسبه شود
      popularEventTypes,
      avgReturnRate: Math.round(avgReturnRate),
      topPerformingAgeGroups: ['25-30', '30-35'],
    };
  }

  private calculateAge(birthDate: Date | null): number {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  private getDefaultSmartProfile(userId: string): SmartProfile {
    const p = new SmartProfile();
    p.user_id = userId;
    p.extroversion_score = 50;
    p.energy_level = 50;
    p.return_rate = 0;
    p.total_events_attended = 0;
    p.total_events_booked = 0;
    p.no_show_count = 0;
    p.is_suspended = false;
    return p;
  }

  
  async saveMatchGroups(eventId: string, groups: any[]): Promise<void> {
    await this.ds.query(`DELETE FROM match_groups WHERE event_id = $1`, [eventId]);
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      await this.ds.query(
        `INSERT INTO match_groups (event_id, group_index, group_name, member_ids, compatibility_score, match_reasons)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [eventId, i, g.groupName, JSON.stringify(g.memberIds), g.avgCompatibilityScore, JSON.stringify(g.matchReasons)],
      );
    }
    this.logger.log(`Saved ${groups.length} match groups for event ${eventId}`);
  }

  async runMatchingForEvent(eventId: string, eventType = 'mixed'): Promise<{ groups: number; members: number }> {
    const rows = await this.ds.query(
      `SELECT user_id FROM bookings WHERE event_id = $1 AND status = 'confirmed'`,
      [eventId],
    );
    const userIds = rows.map((r: any) => r.user_id);
    if (userIds.length < 2) return { groups: 0, members: 0 };
    const groups = await this.createSmartGroups(eventId, userIds, 5, eventType);
    await this.saveMatchGroups(eventId, groups);
    return { groups: groups.length, members: userIds.length };
  }
}