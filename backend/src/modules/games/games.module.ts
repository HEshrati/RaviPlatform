import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService }           from './games.service';
import { GamesController }        from './games.controller';
import { SmartIcebreakerService } from './smart-icebreaker.service';
import { EventQuiz }    from './entities/event-quiz.entity';
import { QuizResult }   from './entities/quiz-result.entity';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';
import { Profile }      from '../profiles/entities/profile.entity';
import { Booking }      from '../bookings/entities/booking.entity';
import { User }         from '../users/entities/user.entity';

@Module({
  imports    : [TypeOrmModule.forFeature([EventQuiz, QuizResult, SmartProfile, Profile, Booking, User])],
  controllers: [GamesController],
  providers  : [GamesService, SmartIcebreakerService],
  exports    : [GamesService, SmartIcebreakerService],
})
export class GamesModule {}
