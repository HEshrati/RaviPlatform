import {
  Controller, Get, Post, Patch, Body, Param,
  Query, UseGuards, Req, ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiContentService } from './ai-content.service';
import { isAdminUser } from '../admin/admin.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiContent } from './entities/ai-content.entity';

@Controller('content')
export class AiContentController {
  constructor(
    private readonly contentService: AiContentService,
    @InjectRepository(AiContent)
    private readonly contentRepo: Repository<AiContent>,
  ) {}

  // ── عمومی: مقالات منتشرشده ────────────────────────────────────────
  @Get('articles')
  async getPublished(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.contentService.getPublishedArticles(
      parseInt(page) || 1,
      parseInt(limit) || 10,
    );
  }

  @Get('articles/:id')
  async getOne(@Param('id') id: string) {
    const content = await this.contentRepo.findOne({
      where: { id },
    });
    if (!content) return { error: 'یافت نشد' };
    
    // افزایش بازدید
    content.view_count += 1;
    await this.contentRepo.save(content);
    
    return content;
  }

  // ── پشتیبانی هوشمند (عمومی) ──────────────────────────────────────
  @Post('support/ask')
  async askSupport(@Body() body: { question: string }) {
    return this.contentService.answerSupportQuestion(body.question);
  }

  // ── ادمین: مدیریت محتوا ─────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post('admin/generate')
  async generateArticle(
    @Body() body: { topic?: string },
    @Req() req: any,
  ) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
    return this.contentService.generatePsychologicalArticle(body.topic);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/drafts')
  async getDrafts(@Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
    return this.contentService.getDrafts();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/approve/:id')
  async approve(@Param('id') id: string, @Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
    return this.contentService.approveAndPublish(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/reject/:id')
  async reject(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @Req() req: any,
  ) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
    return this.contentService.rejectContent(id, body.reason);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/edit/:id')
  async edit(
    @Param('id') id: string,
    @Body() body: { title?: string; body?: string; summary?: string },
    @Req() req: any,
  ) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
    return this.contentService.editContent(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/schedule-weekly')
  async scheduleWeekly(@Req() req: any) {
    if (!isAdminUser(req.user)) throw new ForbiddenException('دسترسی ادمین لازم است');
    await this.contentService.scheduleWeeklyContent();
    return { success: true, message: 'تولید محتوای هفتگی شروع شد' };
  }
}
