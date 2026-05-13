import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { WebhookController } from './webhook.controller';
import { Event } from './entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Booking, User])],
  controllers: [EventsController, WebhookController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
