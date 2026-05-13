import {
  Controller, Get, Post, Body, UseGuards, Req, HttpCode, Ip,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  async getWallet(@Req() req: any) {
    return this.walletService.getWallet(req.user.id);
  }

  @Get('transactions')
  async getTransactions(@Req() req: any) {
    return this.walletService.getTransactions(req.user.id);
  }

  @Post('charge')
  async chargeWallet(
    @Req() req: any,
    @Body() body: { amount: number; callbackUrl?: string },
    @Ip() ip: string,
  ) {
    const callbackUrl = body.callbackUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment-success`;
    return this.walletService.chargeWallet(req.user.id, body.amount, callbackUrl, ip);
  }

  @Post('confirm')
  @HttpCode(200)
  async confirmCharge(@Req() req: any, @Body() body: { paymentId: string }) {
    return this.walletService.confirmCharge(body.paymentId, req.user.id);
  }
}
