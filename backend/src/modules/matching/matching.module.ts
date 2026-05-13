import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { MatchingScheduler } from './matching.scheduler';

@Module({
  imports: [
    ScheduleModule,
    TypeOrmModule.forFeature([SmartProfile, Profile, Booking]),
  ],
  providers: [MatchingService, MatchingScheduler],
  controllers: [MatchingController],
  exports: [MatchingService],
})
export class MatchingModule {}
