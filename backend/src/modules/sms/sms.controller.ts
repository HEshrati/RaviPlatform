import { Controller, Get, Post, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const isAdmin = (u: any) => u?.role === 'admin' || u?.isAdmin;

@Controller('sms')
@UseGuards(JwtAuthGuard)
export class SmsController {
  constructor(private readonly sms: SmsService) {}

  @Get('credit')
  async credit(@Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    return { credit: await this.sms.getCredit() };
  }

  @Post('test')
  async test(@Body() body: { mobile: string }, @Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    return this.sms.sendOtp(body.mobile, '123456');
  }

  @Post('send-reminder')
  async reminder(@Body() body: { mobile: string; name: string; link?: string }, @Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    const link = body.link || `${process.env.FRONTEND_URL}/events`;
    return this.sms.sendBookingReminder(body.mobile, body.name, link);
  }
}
