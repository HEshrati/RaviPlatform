import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CafeAccess } from './entities/cafe-access.entity';
import { CafeAccessService } from './cafe-access.service';
import { CafeAccessController } from './cafe-access.controller';
import { Event } from '../events/entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CafeAccess, Event, Booking]),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'ravi-secret-key' }),
  ],
  providers: [CafeAccessService],
  controllers: [CafeAccessController],
  exports: [CafeAccessService],
})
export class CafeAccessModule {}
