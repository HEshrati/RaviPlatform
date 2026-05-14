import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const { eventId, notes } = createBookingDto as any;
    const booking = this.bookingRepository.create({
      user_id: userId,
      event_id: eventId,
      status: 'pending',
      payment_status: 'unpaid',
      metadata: notes ? { notes } : undefined,
    });
    return await this.bookingRepository.save(booking);
  }

  async findAll(userId: string) {
    return await this.bookingRepository.find({ take: 200,
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findByUserId(userId: string, filters?: { status?: string }) {
    const where: any = { user_id: userId };
    if (filters?.status) where.status = filters.status;
    return await this.bookingRepository.find({ take: 200,
      where,
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!booking) throw new NotFoundException('رزرو یافت نشد');
    return booking;
  }

  async cancel(id: string, userId: string, reason?: string) {
    const booking = await this.findOne(id, userId);
    if (booking.status === 'cancelled') throw new BadRequestException('این رزرو قبلاً لغو شده است');
    booking.status = 'cancelled';
    if (reason) booking.cancellation_reason = reason;
    booking.cancelled_at = new Date();
    return await this.bookingRepository.save(booking);
  }

  async cancelBooking(id: string, userId: string, reason?: string) {
    return this.cancel(id, userId, reason);
  }

  async updateStatus(id: string, status: string) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('رزرو یافت نشد');
    booking.status = status;
    return await this.bookingRepository.save(booking);
  }
}
