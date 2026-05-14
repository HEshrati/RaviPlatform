import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';

@Controller('collaboration')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Get('verify-nezam')
  async verifyNezamCode(@Query('code') code: string) {
    if (!code || code.trim().length === 0) {
      throw new BadRequestException('کد نظام الزامی است');
    }

    const result = await this.collaborationService.verifyNezamCode(code.trim());

    return {
      success: result.valid,
      data: result.valid
        ? {
            name: result.name,
            membershipId: result.membershipId,
            field: result.field,
          }
        : null,
      message: result.valid
        ? 'کد نظام تایید شد'
        : 'کد نظام یافت نشد. لطفاً شماره عضویت معتبر وارد کنید',
    };
  }
}
