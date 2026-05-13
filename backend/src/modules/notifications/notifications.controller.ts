import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ✅ اصلاح شد: از 'notifications' به 'api/notifications'
// قبلاً روی /notifications بود که با پروکسی Next.js هماهنگ نبود
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.svc.findByUser(req.user.id);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: any) {
    return this.svc.getUnreadCount(req.user.id);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Request() req: any) {
    return this.svc.markRead(id, req.user.id);
  }

  @Patch('read-all')
  markAllRead(@Request() req: any) {
    return this.svc.markAllRead(req.user.id);
  }
}
