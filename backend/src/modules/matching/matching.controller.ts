import { Controller, Post, Param, Body, Req, ForbiddenException, UseGuards, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { MatchingService } from './matching.service';
import { isAdminUser } from '../admin/admin.controller';

@UseGuards(JwtAuthGuard)
@Controller('matching')
export class MatchingController {
  private readonly logger = new Logger(MatchingController.name);

  constructor(
    @InjectRepository(SmartProfile)
    private readonly smartProfileRepo: Repository<SmartProfile>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly matchingService: MatchingService,
  ) {}

  @Post('suspend/:userId')
  async suspendUserManually(@Param('userId') userId: string, @Body() body: { reason?: string }, @Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
    let profile = await this.smartProfileRepo.findOne({ where: { user_id: userId } });
    if (!profile) profile = this.smartProfileRepo.create({ user_id: userId });
    profile.is_suspended = true;
    profile.suspension_reason = body.reason || 'ساسپند توسط ادمین';
    profile.suspended_at = new Date();
    await this.smartProfileRepo.save(profile);
    this.logger.log(`User ${userId} manually suspended by admin`);
    return { success: true, userId, suspended: true };
  }

  @Post('create-groups/:eventId')
  async createGroups(
    @Param('eventId') eventId: string,
    @Body() body: { userIds?: string[]; groupSize?: number; eventType?: string },
    @Req() req: any,
  ) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
    const { userIds, groupSize = 5, eventType = 'mixed' } = body;

    let resolvedUserIds = userIds;
    if (!resolvedUserIds || resolvedUserIds.length === 0) {
      const bookings = await this.bookingRepo.find({
        where: { event_id: eventId, status: 'confirmed' },
      });
      resolvedUserIds = bookings.map((b) => b.user_id).filter(Boolean);
    }

    if (resolvedUserIds.length < 2) {
      return { success: false, message: 'کاربران ثبت‌نام‌شده کافی نیست (حداقل ۲ نفر)' };
    }

    const groups = await this.matchingService.createSmartGroups(eventId, resolvedUserIds, groupSize, eventType);
    this.logger.log(`Admin created ${groups.length} groups for event ${eventId}`);
    return {
      success: true,
      eventId,
      groups,
      totalGroups: groups.length,
      totalMatched: resolvedUserIds.length,
    };
  }

  @Post('merge-incomplete-groups/:eventId')
  async mergeIncompleteGroups(@Param('eventId') eventId: string, @Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException();
    const bookings = await this.bookingRepo.find({
      where: { event_id: eventId, status: 'confirmed' },
    });
    if (bookings.length < 2) return { success: false, message: 'کاربران کافی نیست' };
    const userIds = bookings.map((b) => b.user_id).filter(Boolean);
    const groups = await this.matchingService.createSmartGroups(eventId, userIds, 5, 'mixed');
    return {
      success: true,
      eventId,
      totalGroups: groups.length,
      merged: groups.length < userIds.length / 3,
      groups,
    };
  }
}
