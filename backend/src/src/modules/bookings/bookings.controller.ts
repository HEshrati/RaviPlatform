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

@Controller('api/bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  @Get('plus-one-candidates')
  async plusOneCandidates(@Req() req: any, @Query('eventId') eventId?: string) {
    const profiles = await this.userRepo.manager.getRepository('profiles').find({
      where: { is_public: true } as any,
      take: 80,
    }).catch(() => [] as any[]);
    const users: any[] = [];
    for (const profile of profiles as any[]) {
      if (!profile.user_id || profile.user_id === req.user.id) continue;
      if (Number(profile.profile_completion_percentage || 0) < 60) continue;
      if (eventId) {
        const existing = await this.bookingRepo.findOne({ where: { event_id: eventId, user_id: profile.user_id } });
        if (existing && existing.status !== 'cancelled') continue;
      }
      const user = await this.userRepo.findOne({ where: { id: profile.user_id } });
      if (!user || (user as any).isBanned) continue;
      users.push({
        id: user.id,
        name: user.name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'کاربر راوی',
        mobileNumber: user.mobileNumber,
        city: profile.city,
        completionPercentage: profile.profile_completion_percentage || 0,
      });
    }
    return { users };
  }

  /**
   * POST /api/bookings
   * Supports both legacy { service, bookingDate } and new { eventId } formats
   */
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const userId = req.user.id;

    // New event-based booking
    if (body.eventId) {
      return this.bookEventAndInitiatePayment(userId, body.eventId, body.callbackUrl, body.plusOneUserId);
    }

    // Legacy booking format
    return await this.bookingsService.create(userId, body as CreateBookingDto);
  }

  /**
   * Book an event and create a pending payment record.
   * Returns payment URL to redirect user to payment gateway.
   */
  private async bookEventAndInitiatePayment(userId: string, eventId: string, callbackUrl?: string, plusOneUserId?: string) {
    const event = await this.eventRepo.findOne({ where: { id: eventId, is_active: true } });
    if (!event) throw new NotFoundException('رویداد یافت نشد');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('کاربر یافت نشد');

    if ((user as any).isBanned) {
      throw new BadRequestException('حساب کاربری شما مسدود شده است');
    }

    const requestedSeats = plusOneUserId ? 2 : 1;
    if (event.current_bookings + requestedSeats > event.capacity) {
      throw new BadRequestException('ظرفیت رویداد برای این تعداد نفر کافی نیست');
    }

    // Check duplicate booking
    const existing = await this.bookingRepo.findOne({
      where: { event_id: eventId, user_id: userId },
    });
    if (existing && existing.status !== 'cancelled') {
      throw new BadRequestException('قبلاً این رویداد را رزرو کرده‌اید');
    }

    let plusOneBooking: Booking | null = null;
    if (plusOneUserId) {
      if (plusOneUserId === userId) throw new BadRequestException('نمی‌توانید خودتان را به عنوان همراه انتخاب کنید');
      const guest = await this.userRepo.findOne({ where: { id: plusOneUserId } });
      if (!guest) throw new NotFoundException('کاربر همراه یافت نشد');
      const guestProfile = await this.userRepo.manager.getRepository('profiles').findOne({ where: { user_id: plusOneUserId } as any }).catch(() => null as any);
      if (!guestProfile || Number(guestProfile.profile_completion_percentage || 0) < 60) {
        throw new BadRequestException('پروفایل همراه باید تکمیل باشد');
      }
      const guestExisting = await this.bookingRepo.findOne({ where: { event_id: eventId, user_id: plusOneUserId } });
      if (guestExisting && guestExisting.status !== 'cancelled') {
        throw new BadRequestException('همراه انتخاب‌شده قبلاً این رویداد را رزرو کرده است');
      }
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

    if (plusOneUserId) {
      plusOneBooking = (await this.bookingRepo.save(this.bookingRepo.create({
        event_id: eventId,
        user_id: plusOneUserId,
        status: 'pending',
        payment_status: 'unpaid',
        amount_paid: price,
        booking_code: `RV-P1-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        metadata: { reserved_by_user_id: userId, primary_booking_id: savedBooking.id, type: 'plus_one' },
      } as any))) as any as Booking;
    }

    // Create pending payment record (store intended amount for integrity check)
    const payment = this.paymentRepo.create({
      user_id: userId,
      booking_id: savedBooking.id,
      amount: price * requestedSeats,
      currency: 'IRR',
      payment_method: 'zarinpal',
      payment_gateway: 'zarinpal',
      description: `رزرو همنشینی: ${event.title}`,
      status: 'pending',
      metadata: {
        eventId,
        eventTitle: event.title,
        plusOneBookingId: plusOneBooking?.id,
        plusOneUserId,
        intendedAmount: price * requestedSeats, // CRITICAL: store for integrity check on callback
        callbackUrl: callbackUrl || `${API_BASE}/payment-success`,
      },
    } as any);
    const savedPayment = (await this.paymentRepo.save(payment)) as any as Payment;

    // Initiate payment with gateway
    const cb = callbackUrl || `${API_BASE}/payment-success`;
    let paymentUrl: string;

    if (IS_DEV || !ZARINPAL_MERCHANT) {
      // DEV: mock payment URL — simulates gateway redirect
      paymentUrl = `${cb}?bookingId=${savedBooking.id}&paymentId=${savedPayment.id}&mock=true&amount=${price * requestedSeats}`;
    } else {
      // PRODUCTION: real Zarinpal request
      try {
        const _ctrl = new AbortController(); setTimeout(() => _ctrl.abort(), 10000);
      const res =
      await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchant_id: ZARINPAL_MERCHANT,
            amount: price * requestedSeats,
            description: `رزرو همنشینی: ${event.title}`,
            callback_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payments/verify?bookingId=${savedBooking.id}&paymentId=${savedPayment.id}`,
          }),
        });
        const data = await res.json();
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
      amount: price * requestedSeats,
      currency: 'IRR',
      eventTitle: event.title,
      bookingCode: savedBooking.booking_code,
      plusOneBookingId: plusOneBooking?.id,
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
      cancelledAt: booking.cancelledAt,
      cancellationReason: booking.cancellationReason,
      service: booking.service,
      amount: booking.amountPaid,
    };
  }
}
