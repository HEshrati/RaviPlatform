// intelligence.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntelligenceService } from './intelligence.service';
import { IntelligenceController } from './intelligence.controller';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Event } from '../events/entities/event.entity';

export { IntelligenceModule };

// ── Intelligence Module ──────────────────────────────────────────
@Module({
  imports: [TypeOrmModule.forFeature([SmartProfile, Profile, Booking, Event])],
  providers: [IntelligenceService],
  controllers: [IntelligenceController],
  exports: [IntelligenceService],
})
class IntelligenceModule {}
