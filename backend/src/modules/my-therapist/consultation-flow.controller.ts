import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ConsultationFlowService } from './consultation-flow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StartConsultationDto, SelectTopicDto, SelectProviderDto, SubmitConcernsDto } from './dto/start-consultation.dto';

@Controller('consultation-flow')
@UseGuards(JwtAuthGuard)
export class ConsultationFlowController {
  constructor(private readonly svc: ConsultationFlowService) {}

  @Get('topics')
  getTopics(@Query('serviceType') t?: string) { return this.svc.getTopics(t); }

  @Post('start')
  start(@Req() req: any, @Body() dto: StartConsultationDto) {
    return this.svc.startSession(req.user?.id || req.user?.userId, dto);
  }

  @Post(':id/topic')
  selectTopic(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: SelectTopicDto) {
    return this.svc.selectTopic(req.user?.id || req.user?.userId, id, dto);
  }

  @Get(':id/providers')
  getProviders(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.svc.getProviders(id, req.user?.id || req.user?.userId);
  }

  @Post(':id/provider')
  selectProvider(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: SelectProviderDto) {
    return this.svc.selectProvider(req.user?.id || req.user?.userId, id, dto);
  }

  @Get(':id/required-tests')
  getTests(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.svc.getRequiredTests(id, req.user?.id || req.user?.userId);
  }

  @Post(':id/concerns')
  submitConcerns(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: SubmitConcernsDto) {
    return this.svc.submitConcerns(req.user?.id || req.user?.userId, id, dto);
  }

  @Get('my-sessions')
  mySessions(@Req() req: any) { return this.svc.getMySessions(req.user?.id || req.user?.userId); }

  @Get(':id')
  getSession(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.svc.getSession(id, req.user?.id || req.user?.userId);
  }

  // Admin: همه درخواست‌های تکمیل‌شده
  @Get('admin/all-requests')
  async adminAllRequests(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.svc.getAdminRequests(userId);
  }
}

// Admin endpoints
import { Get as GetAdmin } from '@nestjs/common';
