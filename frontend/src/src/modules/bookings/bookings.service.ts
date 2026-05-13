import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../database/entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const { service, bookingDate, notes } = createBookingDto;
    
    const booking = this.bookingRepository.create({
      userId,
      service,
      bookingDate,
      notes,
      status: 'pending',
    });

    return await this.bookingRepository.save(booking);
  }

  async findAll(userId: string) {
    return await this.bookingRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: string, filters?: { status?: string }) {
    const where: any = { userId };
    
    if (filters?.status) {
      where.status = filters.status;
    }

    return await this.bookingRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id, userId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async cancel(id: string, userId: string, reason?: string) {
    const booking = await this.findOne(id, userId);

    if (booking.status === 'cancelled') {
      throw new BadRequestException('Booking already cancelled');
    }

    booking.status = 'cancelled';
    if (reason) {
      booking.cancellationReason = reason;
    }
    booking.cancelledAt = new Date();

    return await this.bookingRepository.save(booking);
  }

  async cancelBooking(id: string, userId: string, reason?: string) {
    return this.cancel(id, userId, reason);
  }

  async updateStatus(id: string, status: string) {
    const booking = await this.bookingRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking.status = status;
    return await this.bookingRepository.save(booking);
  }
}
