import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { AdminModule } from './modules/admin/admin.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { UploadModule } from './modules/upload/upload.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

// ── لایه‌های هوشمندسازی ─────────────────────────────────────────────
import { MatchingModule } from './modules/matching/matching.module';
import { AiContentModule } from './modules/ai-content/ai-content.module';
import { BotModule } from './modules/bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
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
        synchronize: true,
        retryAttempts: 5,
        retryDelay: 3000,
        logging: cs.get('NODE_ENV') !== 'production',
      }),
    }),
    // ── ماژول‌های اصلی ─────────────────────────────────────────────
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
    // ── ماژول‌های هوشمندسازی ───────────────────────────────────────
    MatchingModule,
    AiContentModule,
    BotModule,
  ],
})
export class AppModule {}
