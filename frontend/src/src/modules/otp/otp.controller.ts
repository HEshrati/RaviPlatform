import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('api/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Get('recent')
  async getRecentByMobile(@Query('mobileNumber') mobileNumber: string) {
    return this.otpService.getRecentByMobile(mobileNumber);
  }

  @Post('send')
  async sendOtp(@Body('mobileNumber') mobileNumber: string) {
    const code = await this.otpService.resendOtp(mobileNumber);
    return { message: 'OTP sent successfully' };
  }

  @Post('verify')
  async verifyOtp(
    @Body('mobileNumber') mobileNumber: string,
    @Body('code') code: string,
  ) {
    const isValid = await this.otpService.verifyOtp(mobileNumber, code);
    return { isValid };
  }
}
