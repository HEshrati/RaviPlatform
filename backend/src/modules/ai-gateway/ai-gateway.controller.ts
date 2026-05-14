import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiGatewayService } from './ai-gateway.service';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';

@Controller('ai')
export class AiGatewayController {
  constructor(private readonly aiService: AiGatewayService) {}

  @Post('chat')
  @UseGuards(OptionalJwtGuard)
  async chat(@Body() body: { messages: any[] }) {
    return this.aiService.chat(body.messages);
  }
}
