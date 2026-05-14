import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() body: { phone: string }) {
    return await this.authService.sendOtp(body.phone);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() body: { phone: string; code: string; name?: string }) {
    return await this.authService.verifyOtp(body.phone, body.code, body.name);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return await this.authService.getProfile(req.user.id);
  }

  @Post('mark-test-taken')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async markTestTaken(@Request() req) {
    return await this.authService.markTestTaken(req.user.id);
  }

  /**
   * POST /api/auth/logout
   * Server-side logout — invalidates the current JWT (best-effort logging)
   * JWTs are stateless so we just confirm and let the client clear storage.
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    // Log the logout event
    return { success: true, message: 'با موفقیت خارج شدید' };
  }
}
