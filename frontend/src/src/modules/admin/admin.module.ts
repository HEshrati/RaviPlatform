import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Payment } from '../payments/entities/payment.entity';
import { TestResult } from '../test-results/entities/test-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Event, Booking, Profile, Payment]),
  ],
  controllers: [AdminController],
})
export class AdminModule {}
