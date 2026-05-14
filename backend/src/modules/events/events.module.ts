import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsService }    from './events.service';
import { EventsController } from './events.controller';
import { WebhookController } from './webhook.controller';
import { EventMergeService }  from './event-merge.service';
import { SmsReminderService } from './sms-reminder.service';
import { Event }   from './entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { User }    from '../users/entities/user.entity';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Booking, User, SmartProfile]),
    ScheduleModule.forRoot(),
  ],
  controllers: [EventsController, WebhookController],
  providers  : [EventsService, EventMergeService, SmsReminderService],
  exports    : [EventsService, EventMergeService, SmsReminderService],
})
export class EventsModule {}
