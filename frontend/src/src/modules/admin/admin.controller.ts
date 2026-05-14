import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards, Req, ForbiddenException, HttpCode, HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestResult } from '../test-results/entities/test-result.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Payment } from '../payments/entities/payment.entity';

// همان لیست ادمین‌ها
export const ADMIN_PHONES = [
  '09929564895',
  '09356815523',
  '09933830958',
  
];

export function isAdminUser(user: any): boolean {
  if (!user) return false;
  const raw = user?.mobileNumber || user?.phone_number || '';
  const phone = raw.replace(/[\s\-+]/g, '').replace(/^98/, '0');
  return user.role === 'admin' || user.role === 'super_admin' || ADMIN_PHONES.includes(phone);
}

function requireAdmin(user: any) {
  if (!isAdminUser(user)) throw new ForbiddenException('دسترسی ادمین لازم است');
}

@Controller('api/admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Event) private eventsRepo: Repository<Event>,
    @InjectRepository(Booking) private bookingsRepo: Repository<Booking>,
    @InjectRepository(Profile) private profilesRepo: Repository<Profile>,
    @InjectRepository(Payment) private paymentsRepo: Repository<Payment>,
    @InjectRepository(TestResult) private testResultsRepo: Repository<TestResult>,
  ) {}

  // ── آمار ادمین ─────────────────────────────────────────────────
  @Get('stats')
  async getStats(@Req() req: any) {
    requireAdmin(req.user);
    try {
      const [totalUsers, totalEvents, totalBookings] = await Promise.all([
        this.usersRepo.count(),
        this.eventsRepo.count({ where: { is_active: true } }),
        this.bookingsRepo.count(),
      ]);

      const allBookings = await this.bookingsRepo.find({
        order: { confirmed_at: 'DESC' },
      });
      const completedBookings = allBookings.filter((b) => b.payment_status === 'paid' || b.status === 'confirmed');
      const attended = allBookings.filter((b) => b.attended).length;
      const avgSuccessRate = totalBookings > 0 ? Math.round((attended / totalBookings) * 100) : 0;

      return { totalUsers, totalEvents, totalBookings, avgSuccessRate };
    } catch {
      return { totalUsers: 0, totalEvents: 0, totalBookings: 0, avgSuccessRate: 0 };
    }
  }

  // ── آنالیتیکس کامل ──────────────────────────────────────────────
  @Get('analytics')
  async getAnalytics(@Req() req: any) {
    requireAdmin(req.user);

    try {
      const [totalUsers, totalEvents] = await Promise.all([
        this.usersRepo.count(),
        this.eventsRepo.count({ where: { is_active: true } }),
      ]);

      const allBookings = await this.bookingsRepo.find({
        order: { confirmed_at: 'DESC' },
      });
      const totalBookings = allBookings.length;

      // Revenue
      const allPayments = await this.paymentsRepo.find({ where: { status: 'completed' } });
      const totalRevenue = allPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

      // Bookings per month (last 6 months)
      const now = new Date();
      const bookingsPerMonth = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        const label = d.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' });
        const count = allBookings.filter((b) => {
          const bd = new Date(b.confirmed_at || b.created_at || '');
          return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth();
        }).length;
        return { month: label, count };
      });

      // Revenue per month
      const revenuePerMonth = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        const label = d.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' });
        const revenue = allPayments
          .filter((p) => {
            const pd = new Date(p.created_at || '');
            return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
          })
          .reduce((sum, p) => sum + Number(p.amount || 0), 0);
        return { month: label, revenue };
      });

      // Category breakdown
      const allEvents = await this.eventsRepo.find();
      const catMap: Record<string, number> = {};
      for (const ev of allEvents) {
        const cat = ev.category || ev.event_type || 'سایر';
        catMap[cat] = (catMap[cat] || 0) + 1;
      }
      const categoryBreakdown = Object.entries(catMap).map(([category, count]) => ({ category, count }));

      // Top events by bookings
      const eventsWithBookings = await Promise.all(
        allEvents.slice(0, 10).map(async (ev) => {
          const bookings = allBookings.filter((b) => b.event_id === ev.id);
          const revenue = bookings.reduce((s, b) => s + Number(b.amount_paid || 0), 0);
          return { title: ev.title, bookings: bookings.length, revenue };
        }),
      );
      const topEvents = eventsWithBookings.sort((a, b) => b.bookings - a.bookings).slice(0, 5);

      // User growth (last 6 months)
      const allUsers = await this.usersRepo.find({ order: { createdAt: 'DESC' } });
      const userGrowth = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        const label = d.toLocaleDateString('fa-IR', { month: 'long' });
        const count = allUsers.filter((u) => {
          const ud = new Date(u.createdAt || '');
          return ud.getFullYear() === d.getFullYear() && ud.getMonth() === d.getMonth();
        }).length;
        return { month: label, count };
      });

      return {
        totalUsers,
        totalBookings,
        totalRevenue,
        totalEvents,
        bookingsPerMonth,
        categoryBreakdown,
        revenuePerMonth,
        topEvents,
        userGrowth,
      };
    } catch (err) {
      console.error('Admin analytics error:', err);
      return {
        totalUsers: 0, totalBookings: 0, totalRevenue: 0, totalEvents: 0,
        bookingsPerMonth: [], categoryBreakdown: [], revenuePerMonth: [], topEvents: [],
        userGrowth: [],
      };
    }
  }

  // ── آمار همنشینی‌ها ───────────────────────────────────────────
  @Get('event-stats')
  async getEventStats(@Req() req: any) {
    requireAdmin(req.user);
    const events = await this.eventsRepo.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
    const now = new Date();

    const eventStats = await Promise.all(
      events.map(async (ev) => {
        const bookings = await this.bookingsRepo.find({ where: { event_id: ev.id } });
        const attended = bookings.filter((b) => b.attended).length;
        const reserved = bookings.length;
        const successRate = reserved > 0 ? Math.round((attended / reserved) * 100) : 0;
        return {
          eventId: ev.id,
          title: ev.title,
          capacity: ev.capacity,
          reserved,
          attended,
          successRate,
          date: new Date(ev.start_date).toLocaleDateString('fa-IR'),
          isActive: new Date(ev.end_date) > now,
        };
      }),
    );

    const avgSuccessRate =
      eventStats.length > 0
        ? Math.round(eventStats.reduce((s, e) => s + e.successRate, 0) / eventStats.length)
        : 0;

    return { events: eventStats, totalEvents: events.length, avgSuccessRate };
  }

  // ── لیست کاربران (با فیلتر شهر) ────────────────────────────────
  @Get('users')
  async getUsers(
    @Req() req: any,
    @Query('city') city?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    requireAdmin(req.user);

    try {
      const skip = (Number(page) - 1) * Number(limit);
      const [users, total] = await this.usersRepo.findAndCount({
        order: { createdAt: 'DESC' },
        skip,
        take: Number(limit),
      });

      // Enrich with profile data (city)
      const enriched = await Promise.all(
        users.map(async (u) => {
          const profile = await this.profilesRepo.findOne({ where: { user_id: u.id } }).catch(() => null);
          const userCity = profile?.city || '';
          const bookingCount = await this.bookingsRepo.count({ where: { user_id: u.id } }).catch(() => 0);
          const latestTestResult = await this.testResultsRepo.findOne({
            where: { user_id: u.id },
            order: { completed_at: 'DESC' },
          }).catch(() => null);
          return {
            id: u.id,
            name: u.name || '',
            mobileNumber: u.mobileNumber,
            city: userCity,
            role: u.role,
            isTestTaken: u.isTestTaken,
            createdAt: u.createdAt,
            bookingCount,
            latestTestResult: latestTestResult ? {
              id: latestTestResult.id,
              test_name: latestTestResult.test_name,
              main_result: latestTestResult.main_result,
              scores: latestTestResult.scores,
              completed_at: latestTestResult.completed_at,
            } : null,
          };
        }),
      );

      const filtered = city ? enriched.filter((u) => u.city === city) : enriched;
      return { users: filtered, total: city ? filtered.length : total };
    } catch (err) {
      console.error('Admin users error:', err);
      return { users: [], total: 0 };
    }
  }

  // ── تغییر نقش کاربر ───────────────────────────────────────────
  @Patch('users/:id/role')
  async updateUserRole(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { role?: 'user' | 'admin' },
  ) {
    requireAdmin(req.user);
    if (!['user', 'admin'].includes(body.role || '')) {
      throw new ForbiddenException('نقش نامعتبر است');
    }
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new ForbiddenException('کاربر یافت نشد');
    user.role = body.role!;
    const saved = await this.usersRepo.save(user);
    return {
      id: saved.id,
      name: saved.name || '',
      mobileNumber: saved.mobileNumber,
      role: saved.role,
      isTestTaken: saved.isTestTaken,
      createdAt: saved.createdAt,
    };
  }

  // ── پروفایل کاربر برای ادمین ───────────────────────────────────
  @Get('users/:id/profile')
  async getUserProfile(@Req() req: any, @Param('id') id: string) {
    requireAdmin(req.user);
    const user = await this.usersRepo.findOne({ where: { id } });
    const profile = await this.profilesRepo.findOne({ where: { user_id: id } }).catch(() => null);
    const bookings = await this.bookingsRepo.find({ where: { user_id: id } }).catch(() => []);
    return { user, profile, bookingCount: bookings.length, bookings };
  }

  // ── لیست همه رزروها (ادمین) ────────────────────────────────────
  @Get('bookings')
  async getAllBookings(
    @Req() req: any,
    @Query('eventId') eventId?: string,
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 30,
  ) {
    requireAdmin(req.user);

    try {
      const where: any = {};
      if (eventId) where.event_id = eventId;
      if (status) where.status = status;

      const skip = (Number(page) - 1) * Number(limit);
      const [bookings, total] = await this.bookingsRepo.findAndCount({
        where,
        order: { confirmed_at: 'DESC' },
        skip,
        take: Number(limit),
        relations: ['user', 'event'],
      });

      return { bookings, total };
    } catch {
      return { bookings: [], total: 0 };
    }
  }

  // ── تغییر وضعیت رزرو ────────────────────────────────────────────
  @Patch('bookings/:id')
  async updateBooking(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status?: string; payment_status?: string },
  ) {
    requireAdmin(req.user);
    const booking = await this.bookingsRepo.findOne({ where: { id } });
    if (!booking) throw new ForbiddenException('رزرو یافت نشد');
    if (body.status) booking.status = body.status;
    if (body.payment_status) booking.payment_status = body.payment_status;
    return await this.bookingsRepo.save(booking);
  }

  // ── حذف رزرو ─────────────────────────────────────────────────────
  @Delete('bookings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBooking(@Req() req: any, @Param('id') id: string) {
    requireAdmin(req.user);
    await this.bookingsRepo.delete(id);
  }
}
