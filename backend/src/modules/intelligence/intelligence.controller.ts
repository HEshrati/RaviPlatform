import { Controller, Get, Post, Patch, Body, Param, Req, ForbiddenException, UseGuards, Logger, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';
import { User } from '../users/entities/user.entity';
import { IntelligenceService }    from './intelligence.service';
import { SeasonalAnalysisService } from './seasonal-analysis.service';
import { PopularEventsService }    from './popular-events.service';

function isAdmin(u: any) { return u?.role === 'admin' || u?.isAdmin; }

@UseGuards(JwtAuthGuard)
@Controller('intelligence')
export class IntelligenceController {
  private readonly logger = new Logger(IntelligenceController.name);
  constructor(
    private readonly intelligenceService: IntelligenceService,
    private readonly seasonalService: SeasonalAnalysisService,
    private readonly popularEventsService: PopularEventsService,
    @InjectRepository(SmartProfile) private spRepo: Repository<SmartProfile>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  @Get('stats')
  async getStats(@Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    return this.intelligenceService.getIntelligenceStats();
  }

  @Get('suspended-users')
  async getSuspendedUsers(@Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    const profiles = await this.spRepo.find({ where: { is_suspended: true } });
    const users = await Promise.all(profiles.map(async sp => {
      const user = await this.userRepo.findOne({ where: { id: sp.user_id } });
      return { user_id: sp.user_id, name: user?.name || 'نامشخص', phone: user?.mobileNumber, suspension_reason: sp.suspension_reason, suspended_at: sp.suspended_at, no_show_count: sp.no_show_count, is_banned: user?.isBanned || false };
    }));
    return { users, total: users.length };
  }

  @Patch('unsuspend/:userId')
  async unsuspendUser(@Param('userId') userId: string, @Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    const sp = await this.spRepo.findOne({ where: { user_id: userId } });
    if (sp) { sp.is_suspended = false; sp.suspension_reason = null; sp.suspended_at = null; await this.spRepo.save(sp); }
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) { user.isBanned = false; (user as any).banReason = null; await this.userRepo.save(user); }
    this.logger.log(`Unsuspended user ${userId}`);
    return { success: true };
  }

  @Get('demand-insights')
  async getDemandInsights(@Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    const profiles = await this.spRepo.find();
    const all = profiles.flatMap(p => p.next_event_interests || []);
    const cnt: Record<string,number> = {};
    for (const i of all) cnt[i] = (cnt[i] || 0) + 1;
    const topInterests = Object.entries(cnt).sort(([,a],[,b]) => b-a).slice(0,15).map(([interest,count]) => ({ interest, count }));
    const churnRisk = profiles.filter(p => p.total_events_booked > 1 && p.return_rate < 0.3).length;
    return { topInterests, churnRiskCount: churnRisk, totalUsersAnalyzed: profiles.length, suggestedNextEvents: topInterests.slice(0,3).map(i => ({ type: i.interest, demand: i.count, priority: i.count > 5 ? 'high' : 'medium' })) };
  }

  @Post('register-demand')
  async registerDemand(@Body() body: { userId: string; interests: string[]; source: string }) {
    let p = await this.spRepo.findOne({ where: { user_id: body.userId } });
    if (!p) p = this.spRepo.create({ user_id: body.userId });
    const merged = [...new Set([...(p.next_event_interests || []), ...body.interests])].slice(0,20);
    p.next_event_interests = merged;
    await this.spRepo.save(p);
    return { success: true, totalInterests: merged.length };
  }

  @Get('weekly-report')
  async weeklyReport(@Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    const [all, suspended] = await Promise.all([this.spRepo.find(), this.spRepo.count({ where: { is_suspended: true } })]);
    const avgReturnRate = all.length > 0 ? Math.round(all.reduce((s,p) => s+(p.return_rate||0), 0)/all.length*100) : 0;
    const interests = all.flatMap(p => p.next_event_interests||[]).reduce((a,i) => { a[i]=(a[i]||0)+1; return a; }, {} as Record<string,number>);
    const mostRequested = Object.entries(interests).sort(([,a],[,b]) => b-a)[0]?.[0] || '—';
    return { totalSmartProfiles: all.length, suspendedCount: suspended, avgReturnRate, mostRequestedEvent: mostRequested, communicationDist: { introvert: all.filter(p=>p.communication_type==='introvert').length, extrovert: all.filter(p=>p.communication_type==='extrovert').length, ambivert: all.filter(p=>p.communication_type==='ambivert').length }, generatedAt: new Date().toISOString() };
  }

  @Get('my-profile')
  async getMySmartProfile(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) return {};
    try {
      const sp = await this.spRepo.findOne({ where: { user_id: userId } });
      return sp || {};
    } catch {
      return {};
    }
  }
}
