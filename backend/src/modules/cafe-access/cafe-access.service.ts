import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { CafeAccess } from "./entities/cafe-access.entity";
import { Event } from "../events/entities/event.entity";
import { Booking } from "../bookings/entities/booking.entity";

@Injectable()
export class CafeAccessService {
  private readonly logger = new Logger(CafeAccessService.name);

  constructor(
    @InjectRepository(CafeAccess) private cafeRepo: Repository<CafeAccess>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const cafe = await this.cafeRepo.findOne({
      where: { username, is_active: true },
    });
    if (!cafe) throw new UnauthorizedException("نام کاربری یا رمز اشتباه است");
    const valid = await bcrypt.compare(password, cafe.password_hash);
    if (!valid) throw new UnauthorizedException("نام کاربری یا رمز اشتباه است");
    const token = this.jwtService.sign(
      { sub: cafe.id, username: cafe.username, role: "cafe" },
      { expiresIn: "12h" },
    );
    return { token, cafeName: cafe.cafe_name, cafeId: cafe.id };
  }

  async getTodayEvents(cafeId: string) {
    const cafe = await this.cafeRepo.findOne({ where: { id: cafeId } });
    if (!cafe) throw new NotFoundException("کافه یافت نشد");
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );
    const events = await this.eventRepo
      .createQueryBuilder("e")
      .where("e.city = :city", { city: cafe.city })
      .andWhere("e.start_date >= :start", { start })
      .andWhere("e.start_date <= :end", { end })
      .andWhere("e.is_active = true")
      .getMany();
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      start_date: e.start_date,
      end_date: e.end_date,
      capacity: e.capacity,
    }));
  }

  /**
   * رویدادهای آینده (۷ روز آینده) برای ربات تلگرام
   * کافه ادمین می‌تونه رویداد رو از این لیست انتخاب کنه
   */
  async getUpcomingEvents(cafeId: string, days: number = 7) {
    const cafe = await this.cafeRepo.findOne({ where: { id: cafeId } });
    if (!cafe) throw new NotFoundException("کافه یافت نشد");
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const events = await this.eventRepo
      .createQueryBuilder("e")
      .where("e.city = :city", { city: cafe.city })
      .andWhere("e.start_date >= :now", { now })
      .andWhere("e.start_date <= :future", { future })
      .andWhere("e.is_active = true")
      .orderBy("e.start_date", "ASC")
      .getMany();
    return {
      cafe: { name: cafe.cafe_name, city: cafe.city },
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        start_date: e.start_date,
        end_date: e.end_date,
        capacity: e.capacity,
        location: e.location,
      })),
    };
  }

  async getAttendanceList(eventId: string, cafeId: string) {
    const cafe = await this.cafeRepo.findOne({ where: { id: cafeId } });
    if (!cafe) throw new NotFoundException("کافه یافت نشد");
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException("رویداد یافت نشد");
    if (event.city !== cafe.city)
      throw new UnauthorizedException("این رویداد در شهر شما نیست");
    const bookings = await this.bookingRepo.find({
      where: { event_id: eventId, payment_status: "paid" },
      relations: ["user"],
    });
    return {
      event: {
        id: event.id,
        title: event.title,
        start_date: event.start_date,
        location: event.location,
      },
      cafe: { name: cafe.cafe_name },
      attendees: bookings.map((b) => ({
        bookingId: b.id,
        userId: b.user_id,
        name: b.user?.name || "نامشخص",
        phone: b.user?.mobileNumber,
        attended: b.attended,
        attendanceMarkedAt: b.attendance_marked_at,
      })),
    };
  }

  async markAttendance(
    eventId: string,
    cafeId: string,
    attendances: { userId: string; attended: boolean }[],
  ) {
    const cafe = await this.cafeRepo.findOne({ where: { id: cafeId } });
    if (!cafe) throw new NotFoundException("کافه یافت نشد");
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException("رویداد یافت نشد");
    if (event.city !== cafe.city)
      throw new UnauthorizedException("دسترسی غیرمجاز");
    let count = 0;
    for (const a of attendances) {
      const booking = await this.bookingRepo.findOne({
        where: { event_id: eventId, user_id: a.userId },
      });
      if (!booking) continue;
      booking.attended = a.attended;
      booking.attendance_marked_at = new Date();
      await this.bookingRepo.save(booking);
      count++;
    }
    this.logger.log(
      `Cafe ${cafe.cafe_name} marked ${count} attendances for event ${eventId}`,
    );
    return { success: true, marked: count };
  }

  async createCafe(data: {
    username: string;
    password: string;
    cafe_name: string;
    city: string;
    address?: string;
    price_tier: string;
  }) {
    const password_hash = await bcrypt.hash(data.password, 10);
    const cafe = this.cafeRepo.create({ ...data, password_hash });
    return await this.cafeRepo.save(cafe);
  }

  async listCafes() {
    const cafes = await this.cafeRepo.find({ order: { created_at: "DESC" } });
    return cafes.map((c) => ({
      id: c.id,
      username: c.username,
      cafe_name: c.cafe_name,
      city: c.city,
      address: c.address,
      price_tier: c.price_tier,
      is_active: c.is_active,
      telegram_linked: !!c.telegram_id,
      telegram_id: c.telegram_id,
    }));
  }

  /**
   * کافه‌های لینک‌شده به تلگرام در یک شهر
   * n8n از این اندپوینت استفاده می‌کنه تا بدونه کدوم کافه‌ها رو نوتیفای کنه
   */
  async getLinkedCafesByCity(city: string) {
    const cafes = await this.cafeRepo.find({
      where: { city, is_active: true },
    });
    return cafes
      .filter((c) => !!c.telegram_id)
      .map((c) => ({
        cafeId: c.id,
        cafeName: c.cafe_name,
        telegramId: c.telegram_id,
        city: c.city,
      }));
  }

  /**
   * همه کافه‌های لینک‌شده به تلگرام (برای نوتیفیکیشن دستی)
   */
  async getAllLinkedCafes() {
    const cafes = await this.cafeRepo.find({ where: { is_active: true } });
    return cafes
      .filter((c) => !!c.telegram_id)
      .map((c) => ({
        cafeId: c.id,
        cafeName: c.cafe_name,
        telegramId: c.telegram_id,
        city: c.city,
      }));
  }

  async toggleCafe(cafeId: string, active: boolean) {
    await this.cafeRepo.update(cafeId, { is_active: active });
    return { success: true };
  }

  async computeVenuePriceTier(
    eventId: string,
  ): Promise<"budget" | "medium" | "expensive"> {
    const bookings = await this.bookingRepo.find({
      where: { event_id: eventId, payment_status: "paid" },
    });
    const counts = { budget: 0, medium: 0, expensive: 0 };
    for (const b of bookings) {
      const p = (b.metadata as any)?.price_preference as string;
      if (p === "budget" || p === "medium" || p === "expensive") counts[p]++;
    }
    const total = counts.budget + counts.medium + counts.expensive;
    if (total === 0) return "medium";
    const avg =
      (counts.budget * 1 + counts.medium * 2 + counts.expensive * 3) / total;
    if (avg < 1.67) return "budget";
    if (avg < 2.34) return "medium";
    return "expensive";
  }
}
