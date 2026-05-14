/**
 * اضافه کردن به intelligence.controller.ts
 * لایه ۷ - تحلیل تعاملات + لایه ۱۰ - هوش استراتژیک
 */

// ── دریافت تقاضاهای پرتکرار کاربران (ادمین) ──────────────────
@Get('demand-insights')
async getDemandInsights(@Req() req: any) {
  if (!isAdminUser(req.user)) throw new ForbiddenException();

  const profiles = await this.smartProfileRepo.find();

  // جمع‌آوری علایق
  const allInterests = profiles.flatMap((p) => p.next_event_interests || []);
  const interestCount: Record<string, number> = {};
  for (const i of allInterests) {
    interestCount[i] = (interestCount[i] || 0) + 1;
  }
  const topInterests = Object.entries(interestCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([interest, count]) => ({ interest, count }));

  // شناسایی لیدرهای اجتماعی
  const socialLeaders = profiles
    .filter((p) => p.telegram_behavior?.is_initiator || p.telegram_behavior?.is_bridge)
    .slice(0, 10)
    .map((p) => ({
      userId: p.user_id,
      isInitiator: p.telegram_behavior?.is_initiator,
      isBridge: p.telegram_behavior?.is_bridge,
      totalEvents: p.total_events_attended,
      returnRate: Math.round((p.return_rate || 0) * 100),
    }));

  // پیش‌بینی ریزش (نرخ بازگشت پایین + غیبت زیاد)
  const churnRisk = profiles
    .filter((p) => p.total_events_booked > 1 && p.return_rate < 0.3)
    .length;

  // بهترین بازه سنی
  // در اینجا به داده‌های profile نیاز داریم - این را با join بگیرید

  return {
    topInterests,
    socialLeaders,
    churnRiskCount: churnRisk,
    totalUsersAnalyzed: profiles.length,
    suggestedNextEvents: topInterests.slice(0, 3).map((i) => ({
      type: i.interest,
      demand: i.count,
      priority: i.count > 5 ? 'high' : 'medium',
    })),
  };
}

// ── ثبت نیاز کاربر از تلگرام ────────────────────────────────
@Post('register-demand')
async registerUserDemand(
  @Body() body: { userId: string; interests: string[]; source: 'telegram' | 'survey' | 'site' },
) {
  // این endpoint توسط n8n یا bot فراخوانی می‌شود
  let profile = await this.smartProfileRepo.findOne({ where: { user_id: body.userId } });
  if (!profile) {
    profile = this.smartProfileRepo.create({ user_id: body.userId });
  }

  const existing = profile.next_event_interests || [];
  const merged = [...new Set([...existing, ...body.interests])].slice(0, 20);
  profile.next_event_interests = merged;

  await this.smartProfileRepo.save(profile);
  return { success: true, totalInterests: merged.length };
}

// ── گزارش هفتگی (ادمین) ─────────────────────────────────────
@Get('weekly-report')
async getWeeklyReport(@Req() req: any) {
  if (!isAdminUser(req.user)) throw new ForbiddenException();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [allProfiles, suspendedCount] = await Promise.all([
    this.smartProfileRepo.find(),
    this.smartProfileRepo.count({ where: { is_suspended: true } }),
  ]);

  const avgReturnRate = allProfiles.length > 0
    ? Math.round(allProfiles.reduce((s, p) => s + (p.return_rate || 0), 0) / allProfiles.length * 100)
    : 0;

  // کاربران غیرفعال (بدون event در ۳۰ روز اخیر)
  const inactiveUsers = allProfiles.filter((p) => {
    if (!p.updated_at) return false;
    const daysSinceUpdate = (Date.now() - new Date(p.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > 14 && p.total_events_attended === 0;
  }).length;

  const allInterests = allProfiles.flatMap((p) => p.next_event_interests || []);
  const topInterest = allInterests.reduce((acc, i) => {
    acc[i] = (acc[i] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostRequested = Object.entries(topInterest).sort(([,a],[,b]) => b - a)[0]?.[0] || '—';

  return {
    period: 'هفته گذشته',
    totalSmartProfiles: allProfiles.length,
    suspendedCount,
    avgReturnRate,
    inactiveUsers,
    mostRequestedEvent: mostRequested,
    communicationDist: {
      introvert: allProfiles.filter(p => p.communication_type === 'introvert').length,
      extrovert: allProfiles.filter(p => p.communication_type === 'extrovert').length,
      ambivert: allProfiles.filter(p => p.communication_type === 'ambivert').length,
    },
    generatedAt: new Date().toISOString(),
  };
}
