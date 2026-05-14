import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Event } from '../events/entities/event.entity';
import { Payment } from '../payments/entities/payment.entity';
import { User } from '../users/entities/user.entity';

const API_BASE = process.env.FRONTEND_URL || 'http://localhost:3000';
const ZARINPAL_MERCHANT = process.env.ZARINPAL_MERCHANT_ID || '';
const IS_DEV = process.env.NODE_ENV !== 'production';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  /**
   * POST /api/bookings
   * Supports both legacy { service, bookingDate } and new { eventId } formats
   */
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const userId = req.user.id;

    // New event-based booking
    if (body.eventId) {
      return this.bookEventAndInitiatePayment(userId, body.eventId, body.callbackUrl);
    }

    // Legacy booking format
    return await this.bookingsService.create(userId, body as CreateBookingDto);
  }

  /**
   * Book an event and create a pending payment record.
   * Returns payment URL to redirect user to payment gateway.
   */
  private async bookEventAndInitiatePayment(userId: string, eventId: string, callbackUrl?: string) {
    const event = await this.eventRepo.findOne({ where: { id: eventId, is_active: true } });
    if (!event) throw new NotFoundException('رویداد یافت نشد');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('کاربر یافت نشد');

    if ((user as any).isBanned) {
      throw new BadRequestException('حساب کاربری شما مسدود شده است');
    }

    if (event.current_bookings >= event.capacity) {
      throw new BadRequestException('ظرفیت رویداد تکمیل است');
    }

    // Check duplicate booking
    const existing = await this.bookingRepo.findOne({
      where: { event_id: eventId, user_id: userId },
    });
    if (existing && existing.status !== 'cancelled') {
      throw new BadRequestException('قبلاً این رویداد را رزرو کرده‌اید');
    }

    const price = Number(event.price);

    // Create pending booking
    const booking = this.bookingRepo.create({
      event_id: eventId,
      user_id: userId,
      status: 'pending',
      payment_status: 'unpaid',
      amount_paid: price,
      booking_code: `RV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    } as any);
    const savedBooking = (await this.bookingRepo.save(booking)) as any as Booking;

    // Create pending payment record (store intended amount for integrity check)
    const payment = this.paymentRepo.create({
      user_id: userId,
      booking_id: savedBooking.id,
      amount: price,
      currency: 'IRR',
      payment_method: 'zarinpal',
      payment_gateway: 'zarinpal',
      description: `رزرو همنشینی: ${event.title}`,
      status: 'pending',
      metadata: {
        eventId,
        eventTitle: event.title,
        intendedAmount: price, // CRITICAL: store for integrity check on callback
        callbackUrl: callbackUrl || `${API_BASE}/payment-success`,
      },
    } as any);
    const savedPayment = (await this.paymentRepo.save(payment)) as any as Payment;

    // Initiate payment with gateway
    const cb = callbackUrl || `${API_BASE}/payment-success`;
    let paymentUrl: string;

    if (IS_DEV || !ZARINPAL_MERCHANT) {
      // DEV: mock payment URL — simulates gateway redirect
      paymentUrl = `${cb}?bookingId=${savedBooking.id}&paymentId=${savedPayment.id}&mock=true&amount=${price}`;
    } else {
      // PRODUCTION: real Zarinpal request
      try {
        const _ctrl = new AbortController(); setTimeout(() => _ctrl.abort(), 10000);
        const res = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchant_id: ZARINPAL_MERCHANT,
            amount: price,
            description: `رزرو همنشینی: ${event.title}`,
            callback_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payments/verify?bookingId=${savedBooking.id}&paymentId=${savedPayment.id}`,
          }),
        });
        const data = await res.json() as any;
        if (data?.data?.code === 100) {
          paymentUrl = `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`;
          savedPayment.gateway_transaction_id = data.data.authority;
          await this.paymentRepo.save(savedPayment);
        } else {
          throw new Error(data?.errors?.message || 'Zarinpal request failed');
        }
      } catch (err) {
        // If Zarinpal fails, clean up pending records
        await this.bookingRepo.delete(savedBooking.id);
        await this.paymentRepo.delete(savedPayment.id);
        throw new BadRequestException('اتصال به درگاه پرداخت ناموفق بود. دوباره تلاش کنید.');
      }
    }

    return {
      bookingId: savedBooking.id,
      paymentId: savedPayment.id,
      paymentUrl,
      amount: price,
      currency: 'IRR',
      eventTitle: event.title,
      bookingCode: savedBooking.booking_code,
    };
  }

  @Get()
  async findAll(@Req() req: any, @Query('status') status?: string) {
    return await this.bookingsService.findByUserId(req.user.id, { status });
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return await this.bookingsService.findOne(id, req.user.id);
  }

  @Post(':id/cancel')
  async cancel(@Req() req: any, @Param('id') id: string, @Body('reason') reason?: string) {
    const booking = await this.bookingsService.cancelBooking(id, req.user.id, reason);
    return {
      id: booking.id,
      status: booking.status,
      cancelledAt: booking.cancelled_at,
      cancellationReason: booking.cancellation_reason,
      
      amount: booking.amount_paid,
    };
  }
}
