import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req, ForbiddenException, Query } from '@nestjs/common';
import { GamesService }           from './games.service';
import { SmartIcebreakerService } from './smart-icebreaker.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { isAdminUser } from '../events/events.controller';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(
    private games: GamesService,
    private icebreaker: SmartIcebreakerService,
  ) {}

  @Post('quiz')
  async createQuiz(@Body() body: { event_id:string; title:string; questions:any[]; game_type?:string; settings?:any }, @Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException();
    const qs = body.questions.map(q => this.icebreaker.enrichQuestionWithImage(q));
    return this.games.createQuiz(body.event_id, body.title, qs, body.game_type as any, body.settings);
  }

  @Patch('quiz/:id')
  async updateQuiz(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException();
    return this.games.updateQuiz(id, body);
  }

  /** دریافت کوییز با تصاویر خودکار مرتبط با سوال */
  @Get('quiz/event/:eventId')
  async getQuizByEvent(@Param('eventId') eventId: string) {
    return this.icebreaker.getQuizWithImages(eventId);
  }

  /** ��� انتخاب هوشمند: مناسب‌ترین کاربر برای پاسخ به سوال */
  @Get('quiz/:quizId/smart-assign')
  async smartAssign(
    @Param('quizId') quizId: string,
    @Query('eventId') eventId: string,
    @Query('questionIdx') questionIdx: string,
  ) {
    return this.icebreaker.assignNextQuestion(eventId, quizId, parseInt(questionIdx || '0'));
  }

  @Get('my-quizzes')
  async getMyQuizzes() {
    return { quizzes:[], message:'برای دیدن بازی‌ها باید همنشینی رزرو کنید' };
  }

  @Post('quiz/:id/submit')
  async submitQuiz(@Param('id') id: string, @Body() body: { answers:number[] }, @Req() req: any) {
    return this.games.submitQuiz(id, req.user.id, body.answers);
  }

  @Get('quiz/:id/leaderboard')
  async leaderboard(@Param('id') id: string) {
    return this.games.getLeaderboard(id);
  }
}
