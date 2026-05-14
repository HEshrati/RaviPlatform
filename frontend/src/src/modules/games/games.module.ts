import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { EventQuiz } from './entities/event-quiz.entity';
import { QuizResult } from './entities/quiz-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventQuiz, QuizResult])],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
