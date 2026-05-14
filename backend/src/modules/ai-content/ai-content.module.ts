import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiContent } from './entities/ai-content.entity';
import { AiContentService } from './ai-content.service';
import { AiContentController } from './ai-content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AiContent])],
  controllers: [AiContentController],
  providers: [AiContentService],
  exports: [AiContentService],
})
export class AiContentModule {}
