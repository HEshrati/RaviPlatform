/**
 * CrmModule
 * مسیر: src/modules/crm/crm.module.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmService } from './crm.service';
import { CrmController } from './crm.controller';
import { UserBehaviorEvent } from './entities/user-behavior-event.entity';
import { CrmAiAlert } from './entities/crm-ai-alert.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBehaviorEvent, CrmAiAlert]),
  ],
  controllers: [CrmController],
  providers:   [CrmService],
  exports:     [CrmService],   // برای استفاده در سایر ماژول‌ها
})
export class CrmModule {}
