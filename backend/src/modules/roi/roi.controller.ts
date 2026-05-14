import { Controller, Get, Post, Param, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoiService } from './roi.service';
import { User } from '../users/entities/user.entity';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';

function isAdmin(u: any) { return u?.role === 'admin' || u?.isAdmin; }

@UseGuards(JwtAuthGuard)
@Controller('roi')
export class RoiController {
  constructor(
    private readonly roiService: RoiService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(SmartProfile) private spRepo: Repository<SmartProfile>,
  ) {}

  @Get('event/:id')
  getEventROI(@Param('id') id: string, @Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    return this.roiService.getEventROI(id);
  }

  @Get('monthly')
  getMonthly(@Query('months') m: string, @Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    return this.roiService.getMonthlyROI(Number(m) || 3);
  }

  @Get('dashboard')
  getDashboard(@Query('months') m: string, @Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    return this.roiService.getMonthlyROI(Number(m) || 3);
  }

  @Post('analyze/:id')
  async analyze(@Param('id') id: string, @Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    const result = await this.roiService.analyzeEventWithAI(id);
    const banned: string[] = [];
    for (const uid of result.bannedUsers) {
      const user = await this.userRepo.findOne({ where: { id: uid } });
      if (user && !user.isBanned) {
        user.isBanned = true;
        (user as any).banReason = 'غیبت بیش از ۲ بار';
        await this.userRepo.save(user);
        const sp = await this.spRepo.findOne({ where: { user_id: uid } });
        if (sp) { sp.is_suspended = true; sp.suspension_reason = 'غیبت بیش از ۲ بار'; sp.suspended_at = new Date(); await this.spRepo.save(sp); }
        banned.push(user.name || user.mobileNumber || uid);
      }
    }
    return { ...result, autoBanned: banned, bannedCount: banned.length };
  }
}
