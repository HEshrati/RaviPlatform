import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { isAdminUser } from '../events/events.controller';

@Controller('api/games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Post('quiz')
  async createQuiz(@Body() body: { event_id: string; title: string; questions: any[] }, @Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
    return this.gamesService.createQuiz(body.event_id, body.title, body.questions);
  }

  @Patch('quiz/:id')
  async updateQuiz(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
    return this.gamesService.updateQuiz(id, body);
  }

  @Get('quiz/event/:eventId')
  async getQuizByEvent(@Param('eventId') eventId: string) {
    return this.gamesService.getQuizByEvent(eventId);
  }

  @Get('my-quizzes')
  async getMyQuizzes() {
    return { quizzes: [], message: 'برای دیدن بازی‌ها باید همنشینی رزرو کنید' };
  }

  @Post('quiz/:id/submit')
  async submitQuiz(@Param('id') id: string, @Body() body: { answers: number[] }, @Req() req: any) {
    return this.gamesService.submitQuiz(id, req.user.id, body.answers);
  }

  @Get('quiz/:id/leaderboard')
  async getLeaderboard(@Param('id') id: string) {
    return this.gamesService.getLeaderboard(id);
  }
}
