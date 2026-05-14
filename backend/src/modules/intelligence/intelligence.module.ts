import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { IntelligenceService }    from './intelligence.service';
import { IntelligenceController } from './intelligence.controller';
import { SeasonalAnalysisService } from './seasonal-analysis.service';
import { PopularEventsService }    from './popular-events.service';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';
import { Profile }  from '../profiles/entities/profile.entity';
import { Booking }  from '../bookings/entities/booking.entity';
import { Event }    from '../events/entities/event.entity';
import { User }     from '../users/entities/user.entity';

@Module({
  imports    : [TypeOrmModule.forFeature([SmartProfile, Profile, Booking, Event, User]), ScheduleModule.forRoot()],
  providers  : [IntelligenceService, SeasonalAnalysisService, PopularEventsService],
  controllers: [IntelligenceController],
  exports    : [IntelligenceService, SeasonalAnalysisService, PopularEventsService],
})
export class IntelligenceModule {}
