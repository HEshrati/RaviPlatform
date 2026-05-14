import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async getWallet(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('کاربر یافت نشد');

    return {
      balance: Number(user.credits_balance) || 0,
      currency: 'IRR',
    };
  }

  async getTransactions(userId: string) {
    const payments = await this.paymentsRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: 50,
    });

    return payments.map((p) => ({
      id: p.id,
      type: p.refund_amount ? 'refund' : p.payment_method === 'wallet_debit' ? 'debit' : 'charge',
      amount: Number(p.refund_amount || p.amount),
      description: p.description || (p.payment_method === 'wallet_debit' ? 'پرداخت از کیف پول' : 'شارژ کیف پول'),
      status: p.status,
      createdAt: p.created_at,
      referenceId: p.gateway_reference,
    }));
  }

  async chargeWallet(
    userId: string,
    amount: number,
    callbackUrl: string,
    ipAddress?: string,
  ) {
    if (amount < 10000) {
      throw new BadRequestException('حداقل مبلغ شارژ ۱۰,۰۰۰ تومان است');
    }
    if (amount > 50_000_000) {
      throw new BadRequestException('حداکثر مبلغ شارژ ۵۰,۰۰۰,۰۰۰ تومان است');
    }

    // ثبت تراکنش در انتظار
    const payment = this.paymentsRepository.create({
      user_id: userId,
      amount,
      currency: 'IRR',
      payment_method: 'zarinpal',
      payment_gateway: 'zarinpal',
      description: `شارژ کیف پول به مبلغ ${amount.toLocaleString()} تومان`,
      status: 'pending',
      metadata: { callbackUrl, type: 'wallet_charge' },
      ip_address: ipAddress,
    });

    const savedPayment = await this.paymentsRepository.save(payment);

    // در اینجا درخواست به زرین‌پال ارسال می‌شود
    // برای سادگی، mock response ارائه می‌شود
    // در production باید با ZarinpalService یکپارچه شود
    const mockPaymentUrl = `${callbackUrl}?paymentId=${savedPayment.id}&mock=true`;

    return {
      paymentId: savedPayment.id,
      paymentUrl: mockPaymentUrl,
      amount,
    };
  }

  async confirmCharge(paymentId: string, userId: string) {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId, user_id: userId, status: 'pending' },
    });

    if (!payment) throw new NotFoundException('تراکنش یافت نشد');

    // تأیید پرداخت و افزایش موجودی
    payment.status = 'completed';
    payment.paid_at = new Date();
    await this.paymentsRepository.save(payment);

    // افزایش موجودی کیف پول
    await this.usersRepository.increment(
      { id: userId },
      'credits_balance',
      Number(payment.amount),
    );

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return {
      success: true,
      newBalance: Number(user?.credits_balance) || 0,
      amount: Number(payment.amount),
    };
  }

  async debitWallet(userId: string, amount: number, description: string, bookingId?: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('کاربر یافت نشد');

    const balance = Number(user.credits_balance) || 0;
    if (balance < amount) {
      throw new BadRequestException('موجودی کافی نیست');
    }

    // کسر موجودی
    await this.usersRepository.decrement({ id: userId }, 'credits_balance', amount);

    // ثبت تراکنش
    const payment = this.paymentsRepository.create({
      user_id: userId,
      booking_id: bookingId,
      amount,
      currency: 'IRR',
      payment_method: 'wallet_debit',
      description,
      status: 'completed',
      paid_at: new Date(),
    });

    await this.paymentsRepository.save(payment);

    return { success: true, newBalance: balance - amount };
  }
}
