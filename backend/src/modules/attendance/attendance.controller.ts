import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { isAdminUser } from '../events/events.controller';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * ادمین: لیست حضور و غیاب یک رویداد
   */
  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard)
  async getAttendanceList(@Param('eventId') eventId: string, @Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('فقط ادمین‌ها دسترسی دارند');
    return this.attendanceService.getAttendanceList(eventId);
  }

  /**
   * ادمین: ثبت حضور یا غیاب یک نفر
   */
  @Post('event/:eventId/mark')
  @UseGuards(JwtAuthGuard)
  async markAttendance(
    @Param('eventId') eventId: string,
    @Body() body: { userId: string; attended: boolean },
    @Req() req: any,
  ) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('فقط ادمین‌ها دسترسی دارند');
    return this.attendanceService.markAttendance(
      eventId,
      body.userId,
      body.attended,
      req.user.id,
    );
  }

  /**
   * ادمین: ثبت حضور و غیاب دسته‌ای
   */
  @Post('event/:eventId/bulk-mark')
  @UseGuards(JwtAuthGuard)
  async bulkMarkAttendance(
    @Param('eventId') eventId: string,
    @Body() body: { attendances: { userId: string; attended: boolean }[] },
    @Req() req: any,
  ) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('فقط ادمین‌ها دسترسی دارند');
    return this.attendanceService.bulkMarkAttendance(
      eventId,
      body.attendances,
      req.user.id,
    );
  }

  /**
   * ادمین: درخواست دستی ارسال رتینگ بعد از رویداد
   */
  @Post('event/:eventId/trigger-rating')
  @UseGuards(JwtAuthGuard)
  async triggerRating(@Param('eventId') eventId: string, @Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('فقط ادمین‌ها دسترسی دارند');
    return this.attendanceService.triggerRatingRequest(eventId);
  }

  /**
   * کاربر: ارسال رتینگ به شرکت‌کنندگان همنشینی
   */
  @Post('event/:eventId/rate')
  @UseGuards(JwtAuthGuard)
  async submitRating(
    @Param('eventId') eventId: string,
    @Body() body: { ratings: { targetUserId: string; stars: number; tags?: string[] }[] },
    @Req() req: any,
  ) {
    return this.attendanceService.submitRating(eventId, req.user.id, body.ratings);
  }

  /**
   * کاربر: بررسی وضعیت رتینگ (آیا باید popup نشون داده بشه)
   */
  @Get('event/:eventId/rating-status')
  @UseGuards(JwtAuthGuard)
  async getRatingStatus(@Param('eventId') eventId: string, @Req() req: any) {
    return this.attendanceService.getRatingStatus(eventId, req.user.id);
  }

  /**
   * ادمین: داشبورد آمار حضور
   */
  @Get('admin/dashboard')
  @UseGuards(JwtAuthGuard)
  async getAdminDashboard(@Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('فقط ادمین‌ها دسترسی دارند');
    return this.attendanceService.getAdminAttendanceDashboard(req.user.id);
  }
}
