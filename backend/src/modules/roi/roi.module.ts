import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoiService } from './roi.service';
import { RoiController } from './roi.controller';
import { Event } from '../events/entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Booking, Feedback, SmartProfile, User])],
  providers: [RoiService],
  controllers: [RoiController],
  exports: [RoiService],
})
export class RoiModule {}
