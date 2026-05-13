/**
 * CrmController — API endpoints برای داشبورد ادمین
 * مسیر: src/modules/crm/crm.controller.ts
 */
import {
  Controller, Get, Post, Patch, Body,
  Param, Query, Req, ForbiddenException, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CrmService } from './crm.service';
import { BehaviorEventType, EventSeverity } from './entities/user-behavior-event.entity';
import { AlertStatus } from './entities/crm-ai-alert.entity';
import { isAdminUser } from '../admin/admin.controller';

@Controller('crm')
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private readonly crm: CrmService) {}

  // ── فقط ادمین ──────────────────────────────────────────────────
  private requireAdmin(req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
  }

  // ── ۱. آمار کلی داشبورد ────────────────────────────────────────
  @Get('dashboard')
  async getDashboard(@Req() req: any, @Query('days') days = '7') {
    this.requireAdmin(req);
    return this.crm.getDashboardStats(Number(days));
  }

  // ── ۲. لیست هشدارها ────────────────────────────────────────────
  @Get('alerts')
  async getAlerts(
    @Req() req: any,
    @Query('status') status?: AlertStatus,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    this.requireAdmin(req);
    return this.crm.getAlerts(status, Number(page), Number(limit));
  }

  // ── ۳. بروزرسانی وضعیت هشدار ───────────────────────────────────
  @Patch('alerts/:id')
  async updateAlert(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: AlertStatus; note?: string },
  ) {
    this.requireAdmin(req);
    return this.crm.updateAlertStatus(id, body.status, req.user.id, body.note);
  }

  // ── ۴. trigger تحلیل AI دستی ──────────────────────────────────
  @Post('analyze')
  async triggerAnalysis(@Req() req: any, @Body() body: { hours?: number }) {
    this.requireAdmin(req);
    const alert = await this.crm.triggerManualAnalysis(body.hours ?? 24);
    return {
      success: true,
      alert,
      message: alert ? `هشدار جدید: ${alert.title}` : 'وضعیت سیستم نرمال است ✅',
    };
  }

  // ── ۵. کاربران در خطر ریزش ─────────────────────────────────────
  @Get('churn-risk')
  async getChurnRisk(@Req() req: any) {
    this.requireAdmin(req);
    return this.crm.getChurnRiskUsers();
  }

  // ── ۶. رفتار یک کاربر خاص ──────────────────────────────────────
  @Get('users/:userId/summary')
  async getUserSummary(
    @Req() req: any,
    @Param('userId') userId: string,
    @Query('days') days = '30',
  ) {
    this.requireAdmin(req);
    return this.crm.getUserBehaviorSummary(userId, Number(days));
  }

  @Get('users/:userId/events')
  async getUserEvents(
    @Req() req: any,
    @Param('userId') userId: string,
    @Query('page') page = '1',
  ) {
    this.requireAdmin(req);
    return this.crm.getUserEvents(userId, Number(page));
  }

  // ── ۷. ثبت دستی رویداد از frontend ─────────────────────────────
  // (برای رویدادهایی مثل page_view که از client ارسال می‌شوند)
  @Post('track')
  async trackFromClient(
    @Req() req: any,
    @Body() body: {
      eventType: BehaviorEventType;
      pagePath?: string;
      sessionId?: string;
      metadata?: Record<string, any>;
    },
  ) {
    // این endpoint بدون نیاز به ادمین بودن — کاربر عادی هم می‌تواند
    await this.crm.track({
      userId:    req.user?.id ?? null,
      eventType: body.eventType,
      severity:  EventSeverity.INFO,
      pagePath:  body.pagePath,
      sessionId: body.sessionId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata:  body.metadata,
    });
    return { ok: true };
  }
}
