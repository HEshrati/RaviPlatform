import {
  Controller, Get, Post, Query, Body, BadRequestException, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Event } from '../events/entities/event.entity';
import { User } from '../users/entities/user.entity';

const ZARINPAL_MERCHANT = process.env.ZARINPAL_MERCHANT_ID || '';
const IS_DEV = process.env.NODE_ENV !== 'production';

@Controller('api/payments')
export class PaymentsController {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  /**
   * GET /api/payments/verify
   * Called by Zarinpal after payment (or by our mock in dev mode).
   * Verifies amount integrity before confirming booking.
   */
  @Get('verify')
  async verifyPayment(
    @Query('bookingId') bookingId: string,
    @Query('paymentId') paymentId: string,
    @Query('Authority') authority?: string,
    @Query('Status') status?: string,
    @Query('mock') mock?: string,
    @Query('amount') mockAmount?: string,
  ) {
    if (!bookingId || !paymentId) {
      throw new BadRequestException('پارامترهای تأیید پرداخت ناقص است');
    }

    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('تراکنش یافت نشد');

    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('رزرو یافت نشد');

    const intendedAmount = Number(payment.metadata?.intendedAmount || payment.amount);

    // ── DEV mode: auto-confirm ───────────────────────────────────
    if (IS_DEV || mock === 'true') {
      if (mockAmount && Number(mockAmount) !== intendedAmount) {
        console.warn(`[PAYMENT INTEGRITY] Amount mismatch: received ${mockAmount}, expected ${intendedAmount}`);
        // In dev, we still confirm to allow testing — but log the warning
      }
      await this.confirmPaymentAndBooking(payment, booking, intendedAmount, 'mock-ref-' + Date.now());
      return { success: true, amount: intendedAmount, bookingId, bookingCode: booking.booking_code };
    }

    // ── PRODUCTION: Zarinpal verification ───────────────────────
    if (status !== 'OK') {
      payment.status = 'failed';
      await this.paymentRepo.save(payment);
      throw new BadRequestException('پرداخت توسط کاربر لغو شد');
    }

    try {
      const res = await fetch('https://api.zarinpal.com/pg/v4/payment/verify.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: ZARINPAL_MERCHANT,
          amount: intendedAmount,
          authority,
        }),
      });
      const data = await res.json();

      if (data?.data?.code !== 100 && data?.data?.code !== 101) {
        payment.status = 'failed';
        await this.paymentRepo.save(payment);
        throw new BadRequestException('تأیید پرداخت از درگاه ناموفق بود');
      }

      // CRITICAL: integrity check — verify amount matches
      const receivedAmount = data?.data?.amount;
      if (receivedAmount && Number(receivedAmount) !== intendedAmount) {
        payment.status = 'suspicious';
        payment.metadata = { ...payment.metadata, receivedAmount, flag: 'amount_mismatch' };
        await this.paymentRepo.save(payment);
        console.error(`[SECURITY] Payment amount mismatch! Expected ${intendedAmount}, received ${receivedAmount}`);
        throw new BadRequestException('خطای یکپارچگی پرداخت: مبلغ مغایرت دارد');
      }

      await this.confirmPaymentAndBooking(
        payment, booking, intendedAmount, data?.data?.ref_id?.toString()
      );
      return { success: true, amount: intendedAmount, bookingId, bookingCode: booking.booking_code };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException('خطا در اتصال به درگاه پرداخت');
    }
  }

  /**
   * POST /api/payments/confirm-mock
   * Frontend calls this after mock payment redirect to confirm booking.
   */
  @Post('confirm-mock')
  async confirmMock(@Body() body: { bookingId: string; paymentId: string }) {
    const { bookingId, paymentId } = body;
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!payment || !booking) throw new NotFoundException('تراکنش یافت نشد');

    const amount = Number(payment.metadata?.intendedAmount || payment.amount);
    await this.confirmPaymentAndBooking(payment, booking, amount, 'mock-' + Date.now());
    return { success: true, amount, bookingId, bookingCode: booking.booking_code };
  }

  private async confirmPaymentAndBooking(
    payment: Payment,
    booking: Booking,
    amount: number,
    refId: string,
  ) {
    // Confirm payment
    payment.status = 'completed';
    payment.gateway_reference = refId;
    (payment as any).paid_at = new Date();
    await this.paymentRepo.save(payment);

    // Confirm booking
    booking.status = 'confirmed';
    booking.payment_status = 'paid';
    booking.payment_id = payment.id;
    (booking as any).confirmed_at = new Date();
    await this.bookingRepo.save(booking);

    let seatsToIncrement = 1;
    const plusOneBookingId = payment.metadata?.plusOneBookingId;
    if (plusOneBookingId) {
      const plusOneBooking = await this.bookingRepo.findOne({ where: { id: plusOneBookingId } });
      if (plusOneBooking && plusOneBooking.status !== 'confirmed') {
        plusOneBooking.status = 'confirmed';
        plusOneBooking.payment_status = 'paid';
        plusOneBooking.payment_id = payment.id;
        (plusOneBooking as any).confirmed_at = new Date();
        await this.bookingRepo.save(plusOneBooking);
        seatsToIncrement += 1;
      }
    }

    // Increment event bookings counter
    if (booking.event_id) {
      await this.eventRepo.increment({ id: booking.event_id }, 'current_bookings', seatsToIncrement);
    }
  }
}
