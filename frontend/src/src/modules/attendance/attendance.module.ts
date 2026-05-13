import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Event } from '../events/entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { User } from '../../database/entities/user.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Booking, User, Feedback])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
