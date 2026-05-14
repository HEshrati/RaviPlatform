import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BaleBotService } from './bale-bot.service';

@Controller('bale')
export class BaleBotController {
  constructor(private readonly bot: BaleBotService) {}

  @Post('webhook/:secret')
  async webhook(@Param('secret') secret: string, @Body() update: any) {
    if (secret !== process.env.BALE_BOT_WEBHOOK_SECRET) {
      return { ok: false, error: 'invalid' };
    }
    await this.bot.handleUpdate(update);
    return { ok: true };
  }

  @Get('test-send')
  async testSend(@Query('phone') phone: string, @Query('code') code: string) {
    return this.bot.sendOtp(phone, code || '123456');
  }

  @Get('webhook-info')
  async info() {
    return this.bot.getWebhookInfo();
  }

  @Post('set-webhook')
  async setWebhook(@Body('url') url: string) {
    return this.bot.setWebhook(url);
  }
}
