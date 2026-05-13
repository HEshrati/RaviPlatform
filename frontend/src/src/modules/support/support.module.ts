import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { SupportTicket } from './entities/support-ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupportTicket])],
  providers: [SupportService],
  controllers: [SupportController],
  exports: [SupportService],
})
export class SupportModule {}
