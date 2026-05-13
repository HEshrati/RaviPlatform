import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotController } from './bot.controller';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { SmartProfile } from '../smart-profile/smart-profile.entity';
import { MatchingModule } from '../matching/matching.module';
import { AiContentModule } from '../ai-content/ai-content.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, SmartProfile]),
    MatchingModule,
    AiContentModule,
  ],
  controllers: [BotController],
})
export class BotModule {}
