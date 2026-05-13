import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CafeAccessService } from './cafe-access.service';

function isAdmin(u: any) { return u?.role === 'admin' || u?.isAdmin; }
function isCafe(u: any) { return u?.role === 'cafe'; }

@Controller('cafe')
export class CafeAccessController {
  constructor(private readonly svc: CafeAccessService) {}

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.svc.login(body.username, body.password);
  }

  @Get('today-events')
  @UseGuards(JwtAuthGuard)
  todayEvents(@Req() req: any) {
    if (!isCafe(req.user)) throw new UnauthorizedException('فقط کافه‌ها دسترسی دارند');
    return this.svc.getTodayEvents(req.user.sub);
  }

  @Get('attendance/:eventId')
  @UseGuards(JwtAuthGuard)
  getAttendance(@Param('eventId') eventId: string, @Req() req: any) {
    if (!isCafe(req.user)) throw new UnauthorizedException();
    return this.svc.getAttendanceList(eventId, req.user.sub);
  }

  @Post('attendance/:eventId/mark')
  @UseGuards(JwtAuthGuard)
  markAttendance(@Param('eventId') eid: string, @Body() body: { attendances: { userId: string; attended: boolean }[] }, @Req() req: any) {
    if (!isCafe(req.user)) throw new UnauthorizedException();
    return this.svc.markAttendance(eid, req.user.sub, body.attendances);
  }

  @Post('admin/create')
  @UseGuards(JwtAuthGuard)
  createCafe(@Body() body: any, @Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    return this.svc.createCafe(body);
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard)
  listCafes(@Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    return this.svc.listCafes();
  }

  @Patch('admin/:id/toggle')
  @UseGuards(JwtAuthGuard)
  toggleCafe(@Param('id') id: string, @Body() body: { active: boolean }, @Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    return this.svc.toggleCafe(id, body.active);
  }

  @Get('admin/price-tier/:eventId')
  @UseGuards(JwtAuthGuard)
  priceTier(@Param('eventId') eid: string, @Req() req: any) {
    if (!isAdmin(req.user)) throw new ForbiddenException();
    return this.svc.computeVenuePriceTier(eid).then(t => ({ eventId: eid, recommended_price_tier: t }));
  }
}
