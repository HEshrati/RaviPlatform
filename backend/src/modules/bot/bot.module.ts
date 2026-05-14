import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotController } from './bot.controller';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { CafeAccess } from '../cafe-access/entities/cafe-access.entity';
import { Event } from '../events/entities/event.entity';
import { MatchingModule } from '../matching/matching.module';
import { AiContentModule } from '../ai-content/ai-content.module';
import { CafeAccessModule } from '../cafe-access/cafe-access.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, SmartProfile, Booking, CafeAccess, Event]),
    MatchingModule,
    AiContentModule,
    CafeAccessModule,
  ],
  controllers: [BotController],
})
export class BotModule {}
