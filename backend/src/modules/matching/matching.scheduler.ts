import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MatchingService } from './matching.service';

@Injectable()
export class MatchingScheduler {
  private readonly logger = new Logger(MatchingScheduler.name);

  constructor(
    private readonly matchingService: MatchingService,
    @InjectDataSource() private readonly ds: DataSource,
  ) {}

  // هر ۵ دقیقه چک کن رویدادهایی که ظرفیت پر شده ولی matching نشدن
  @Cron(CronExpression.EVERY_5_MINUTES)
  async runAutoMatching() {
    const events = await this.ds.query(`
      SELECT e.id, e.event_type, e.capacity, e.current_bookings
      FROM events e
      WHERE e.is_active = true
        AND e.current_bookings >= e.capacity
        AND e.start_date > NOW()
        AND NOT EXISTS (
          SELECT 1 FROM match_groups mg WHERE mg.event_id = e.id
        )
    `);

    for (const event of events) {
      try {
        this.logger.log(`Auto-matching event ${event.id} (${event.current_bookings}/${event.capacity})`);
        const result = await this.matchingService.runMatchingForEvent(event.id, event.event_type || 'mixed');
        this.logger.log(`Event ${event.id}: ${result.groups} groups for ${result.members} members`);
      } catch (e) {
        this.logger.error(`Auto-matching failed for event ${event.id}: ${e.message}`);
      }
    }
  }

  // ۲۴ ساعت قبل از رویداد re-matching برای گروه‌های ناقص
  @Cron('0 8 * * *') // هر روز ساعت ۸ صبح
  async rematchIncompleteGroups() {
    const events = await this.ds.query(`
      SELECT e.id, e.event_type
      FROM events e
      WHERE e.is_active = true
        AND e.start_date BETWEEN NOW() AND NOW() + INTERVAL '25 hours'
        AND EXISTS (SELECT 1 FROM match_groups mg WHERE mg.event_id = e.id)
    `);

    for (const event of events) {
      try {
        this.logger.log(`Re-matching event ${event.id} (24h before start)`);
        await this.matchingService.runMatchingForEvent(event.id, event.event_type || 'mixed');
      } catch (e) {
        this.logger.error(`Re-matching failed for event ${event.id}: ${e.message}`);
      }
    }
  }
}
