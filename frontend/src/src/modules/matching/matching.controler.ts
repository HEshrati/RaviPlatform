/**
 * اضافه کردن به matching.controller.ts
 * لایه ۴ - اتوماسیون رویداد
 * لایه ۸ - یادگیری سیستم
 */

// ── ساسپند کردن کاربر توسط ادمین ──────────────────────────────
@Post('suspend/:userId')
async suspendUserManually(
  @Param('userId') userId: string,
  @Body() body: { reason?: string },
  @Req() req: any,
) {
  if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
  
  let profile = await this.smartProfileRepo.findOne({ where: { user_id: userId } });
  if (!profile) {
    profile = this.smartProfileRepo.create({ user_id: userId });
  }
  
  profile.is_suspended = true;
  profile.suspension_reason = body.reason || 'ساسپند توسط ادمین';
  profile.suspended_at = new Date();
  
  await this.smartProfileRepo.save(profile);
  this.logger.log(`User ${userId} manually suspended by admin`);
  
  return { success: true, userId, suspended: true };
}

// ── ادغام خودکار گروه‌های ناقص (12 ساعت قبل از رویداد) ──────
@Post('merge-incomplete-groups/:eventId')
async mergeIncompleteGroups(
  @Param('eventId') eventId: string,
  @Req() req: any,
) {
  if (!isAdminUser(req.user)) throw new ForbiddenException();
  
  // دریافت رزروهای تأیید شده
  const bookings = await this.bookingRepo.find({
    where: { event_id: eventId, status: 'confirmed' },
  });
  
  if (bookings.length < 2) {
    return { success: false, message: 'کاربران کافی نیست' };
  }
  
  const userIds = bookings.map(b => b.user_id).filter(Boolean);
  
  // اجرای الگوریتم مچینگ
  const groups = await this.matchingService.createSmartGroups(
    eventId,
    userIds,
    5, // حداکثر اندازه گروه
    'mixed',
  );
  
  return {
    success: true,
    eventId,
    totalGroups: groups.length,
    merged: groups.length < userIds.length / 3,
    groups,
  };
}

/**
 * اضافه کردن به matching.service.ts
 * به‌روزرسانی پروفایل هوشمند پس از رویداد
 * قانون: ۲ غیبت = تعلیق خودکار
 */
async updateSmartProfileAfterEvent(
  userId: string,
  eventId: string,
  attended: boolean,
  satisfactionScore: number | null,
  telegramData?: { messageCount: number; responseTimeMinutes: number },
): Promise<void> {
  let profile = await this.smartProfileRepo.findOne({ where: { user_id: userId } });
  if (!profile) {
    profile = this.smartProfileRepo.create({ user_id: userId });
  }

  if (attended) {
    // ── شرکت کرده ──
    profile.total_events_attended = (profile.total_events_attended || 0) + 1;
    
    // محاسبه نرخ بازگشت
    const total = (profile.total_events_booked || 0);
    if (total > 0) {
      profile.return_rate = profile.total_events_attended / total;
    }

    // به‌روزرسانی سطح انرژی از تلگرام
    if (telegramData) {
      const energyAdj = telegramData.messageCount > 20 ? 5 : telegramData.messageCount < 3 ? -5 : 0;
      profile.energy_level = Math.max(0, Math.min(100, (profile.energy_level || 50) + energyAdj));
      
      profile.telegram_behavior = {
        ...profile.telegram_behavior,
        avg_messages_per_event: telegramData.messageCount,
        response_time_avg: telegramData.responseTimeMinutes * 60,
        last_group_activity: new Date().toISOString(),
      };
    }

    // به‌روزرسانی رضایت در گروه‌های واکنشی
    if (satisfactionScore !== null) {
      profile.group_reactions = [
        ...(profile.group_reactions || []),
        { eventId, score: satisfactionScore, tags: [] },
      ].slice(-10); // نگه داشتن ۱۰ رویداد اخیر
    }
    
  } else {
    // ── غیبت ──
    profile.no_show_count = (profile.no_show_count || 0) + 1;
    
    // قانون: ۲ غیبت = تعلیق خودکار + نیاز به تأیید ادمین
    if (profile.no_show_count >= 2 && !profile.is_suspended) {
      profile.is_suspended = true;
      profile.suspension_reason = `${profile.no_show_count} بار غیبت بدون اطلاع قبلی`;
      profile.suspended_at = new Date();
      this.logger.warn(`🚫 User ${userId} auto-suspended after ${profile.no_show_count} no-shows`);
      
      // TODO: ارسال پیامک اطلاع‌رسانی
      // TODO: ارسال اعلان به ادمین برای تأیید
    }
  }

  profile.last_ai_update = new Date();
  await this.smartProfileRepo.save(profile);
  this.logger.log(`Smart profile updated: user=${userId} attended=${attended}`);
}
