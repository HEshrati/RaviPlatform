/**
 * app.module.ts — نسخه به‌روزشده با CrmModule
 * تغییرات: اضافه شدن CrmModule و APP_INTERCEPTOR
 * مسیر: src/app.module.ts
 */
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import databaseConfig from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { EventsModule } from './modules/events/events.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TestResultsModule } from './modules/test-results/test-results.module';
import { GamesModule } from './modules/games/games.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { BaleBotModule } from './modules/bale-bot/bale-bot.module';
import { AdminModule } from './modules/admin/admin.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { UploadModule } from './modules/upload/upload.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SupportModule } from './modules/support/support.module';
import { MatchingModule } from './modules/matching/matching.module';
import { IntelligenceModule } from './modules/intelligence/intelligence.module';
import { AiContentModule } from './modules/ai-content/ai-content.module';
import { BotModule } from './modules/bot/bot.module';
import { CafeAccessModule } from './modules/cafe-access/cafe-access.module';
import { RoiModule } from './modules/roi/roi.module';
import { SmsModule } from './modules/sms/sms.module';

// ✅ ماژول CRM جدید
import { CrmModule } from './modules/crm/crm.module';
import { MyTherapistModule } from './modules/my-therapist/my-therapist.module';
import { AiGatewayModule } from './modules/ai-gateway/ai-gateway.module';
import { BehaviorTrackingInterceptor } from './common/interceptors/behavior-tracking.interceptor';

@Module({
  imports: [
    BaleBotModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        type: 'postgres',
        host: cs.get<string>('DB_HOST'),
        port: cs.get<number>('DB_PORT'),
        username: cs.get<string>('DB_USERNAME'),
        password: cs.get<string>('DB_PASSWORD'),
        database: cs.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: cs.get('NODE_ENV') !== 'production',
        retryAttempts: 5,
        retryDelay: 3000,
        logging: cs.get('NODE_ENV') !== 'production',
      }),
    }),
    // ✅ ScheduleModule برای Cron job های CRM
    ScheduleModule.forRoot(),


    // ── ماژول‌های اصلی ─────────────────────────────────────────
    AuthModule,
    UsersModule,
    BookingsModule,
    EventsModule,
    ProfilesModule,
    WalletModule,
    TestResultsModule,
    GamesModule,
    AttendanceModule,
    AdminModule,
    PaymentsModule,
    UploadModule,
    NotificationsModule,
    SupportModule,

    // ── ماژول‌های هوشمندسازی ───────────────────────────────────
    MatchingModule,
    IntelligenceModule,
    AiContentModule,
    BotModule,
    AiGatewayModule,

    // ── ماژول‌های جدید ─────────────────────────────────────────
    CafeAccessModule,
    RoiModule,
    SmsModule,

    // ✅ CRM
    CrmModule,
    // ✅ My Therapist
    MyTherapistModule,
  ],
  providers: [
    // ✅ Interceptor سراسری — همه API callها را ثبت می‌کند
    {
      provide: APP_INTERCEPTOR,
      useClass: BehaviorTrackingInterceptor,
    },
  ],
})
export class AppModule {}
