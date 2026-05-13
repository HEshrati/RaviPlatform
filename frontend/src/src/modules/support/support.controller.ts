import {
  Controller, Get, Post, Patch, Param, Body,
  Req, UseGuards, ForbiddenException, Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { SupportService } from './support.service';
import { TicketCategory, TicketStatus } from './entities/support-ticket.entity';
import { isAdminUser } from '../admin/admin.controller';

@Controller('api/support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // ── چت هوشمند (عمومی) ────────────────────────────────────────
  @UseGuards(OptionalJwtGuard)
  @Post('chat')
  async chat(
    @Body() body: {
      message: string;
      history?: { role: string; content: string }[];
    },
  ) {
    const reply = await this.supportService.chatWithAI(
      body.message,
      body.history || [],
    );
    return { reply };
  }

  // ── ثبت تیکت (کاربر لاگین یا غیرلاگین) ─────────────────────
  @UseGuards(OptionalJwtGuard)
  @Post('ticket')
  async createTicket(
    @Req() req: any,
    @Body() body: {
      subject: string;
      message: string;
      category?: TicketCategory;
      contactPhone?: string;
      contactName?: string;
    },
  ) {
    const userId = req.user?.id || null;
    return await this.supportService.createTicket(userId, body);
  }

  // ── تیکت‌های کاربر جاری ─────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get('my-tickets')
  async myTickets(@Req() req: any) {
    return await this.supportService.findUserTickets(req.user.id);
  }

  // ── ادمین: همه تیکت‌ها ───────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get('admin/tickets')
  async allTickets(@Req() req: any, @Query('status') status?: TicketStatus) {
    if (!isAdminUser(req.user)) throw new ForbiddenException();
    return await this.supportService.findAllTickets(status);
  }

  // ── ادمین: بستن تیکت ─────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Patch('admin/tickets/:id/close')
  async closeTicket(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { response: string },
  ) {
    if (!isAdminUser(req.user)) throw new ForbiddenException();
    return await this.supportService.closeTicket(id, body.response);
  }
}
