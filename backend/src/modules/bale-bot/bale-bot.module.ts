import { Module } from '@nestjs/common';
import { BaleBotService } from './bale-bot.service';
import { BaleBotController } from './bale-bot.controller';

@Module({
  providers: [BaleBotService],
  controllers: [BaleBotController],
  exports: [BaleBotService],
})
export class BaleBotModule {}
