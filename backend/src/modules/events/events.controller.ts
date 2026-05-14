import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OptionalJwtGuard } from "../auth/guards/optional-jwt.guard";

// تمام ادمین‌های سیستم (باید با admin.controller.ts هماهنگ باشه)
export const ADMIN_PHONES = [
  "09356815523",
  "09929564895",
  "09933830958",
];

export function isAdminUser(user: any): boolean {
  if (!user) return false;
  const raw = user?.mobileNumber || user?.phone_number || "";
  const phone = raw.replace(/[\s\-+]/g, "").replace(/^98/, "0");
  return ADMIN_PHONES.includes(phone);
}

function requireAdmin(user: any) {
  if (!isAdminUser(user)) throw new ForbiddenException("دسترسی ادمین لازم است");
}

// ── بررسی فرمت UUID ──────────────────────────────────────────────────
function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

@Controller("events")
export class EventsController {
  constructor(private eventsService: EventsService) {}

  // ── ادمین: آمار موفقیت همنشینی‌ها ──────────────────────────────────
  @Get("admin/stats")
  @UseGuards(JwtAuthGuard)
  async getAdminStats(@Req() req: any) {
    requireAdmin(req.user);
    return this.eventsService.getAdminStats(req.user.id);
  }

  // ── همنشینی‌های ادمین ────────────────────────────────────────────────
  @Get("my-events")
  @UseGuards(JwtAuthGuard)
  async getMyEvents(@Req() req: any) {
    requireAdmin(req.user);
    return this.eventsService.findByCreator(req.user.id);
  }

  // ── پیشنهادات ───────────────────────────────────────────────────────
  @Get("recommendations")
  @UseGuards(JwtAuthGuard)
  async getRecommendations(@Req() req: any) {
    return this.eventsService.getGroupRecommendations(req.user.id);
  }

  // ── ✅ FIX: Route برای category-interests که فرانت صدا می‌زد ─────────
  @Get("category-interests")
  @UseGuards(OptionalJwtGuard)
  async getCategoryInterests(@Req() req: any) {
    // اگر سرویس مربوطه داری اینجا صدا بزن
    // در غیر اینصورت یه آرایه خالی برگردون تا فرانت کرش نکنه
    return [];
  }

  // ── merge باید قبل از :id باشه ──────────────────────────────────────
  @Post("merge")
  @UseGuards(JwtAuthGuard)
  async mergeEvents(
    @Body() body: { sourceEventId: string; targetEventId: string },
    @Req() req: any,
  ) {
    requireAdmin(req.user);
    return { success: false, message: "از EventMergeService استفاده کنید" };
  }

  // ── لیست همنشینی‌ها (فقط شهر عمومی - بدون مکان دقیق) ─────────────
  @Get()
  @UseGuards(OptionalJwtGuard)
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("city") city?: string,
    @Query("event_type") event_type?: string,
    @Req() req?: any,
  ) {
    const userId = req?.user?.id;
    const result = await this.eventsService.findAll({
      page,
      limit,
      city,
      event_type,
      userId,
    });
    // حذف location دقیق از لیست عمومی
    return {
      ...result,
      events: result.events.map((e: any) => ({ ...e, location: undefined })),
    };
  }

  // ── مکان همنشینی: فقط برای رزروکنندگان در ۱۰ ساعت آخر ─────────────
  @Get(":id/location")
  @UseGuards(JwtAuthGuard)
  async getEventLocation(@Param("id") id: string, @Req() req: any) {
    if (!isValidUUID(id))
      throw new BadRequestException("شناسه رویداد معتبر نیست");
    const admin = isAdminUser(req.user);
    return this.eventsService.getLocationForUser(id, req.user.id, admin);
  }

  // ── آپدیت مکان + اعلان SMS و سایت به رزروکنندگان ─────────────────
  @Post(":id/notify-location")
  @UseGuards(JwtAuthGuard)
  async notifyLocationChange(
    @Param("id") id: string,
    @Body() body: { location: string; city: string },
    @Req() req: any,
  ) {
    requireAdmin(req.user);
    if (!isValidUUID(id))
      throw new BadRequestException("شناسه رویداد معتبر نیست");
    return this.eventsService.updateLocationAndNotify(
      id,
      body.location,
      body.city,
    );
  }

  // ── رزروکنندگان یک همنشینی (فقط ادمین) ──────────────────────────
  @Get(":id/attendees")
  @UseGuards(JwtAuthGuard)
  async getEventAttendees(@Param("id") id: string, @Req() req: any) {
    requireAdmin(req.user);
    if (!isValidUUID(id))
      throw new BadRequestException("شناسه رویداد معتبر نیست");
    return this.eventsService.getEventAttendees(id);
  }

  // ── رزرو رویداد توسط کاربر ─────────────────────────────────
  @Post(":id/book")
  @UseGuards(JwtAuthGuard)
  async bookEvent(@Param("id") id: string, @Req() req: any) {
    if (!isValidUUID(id))
      throw new BadRequestException("شناسه رویداد معتبر نیست");
    return this.eventsService.bookEvent(id, req.user.id);
  }

  // ── جزئیات یک همنشینی (بدون location دقیق در پاسخ عمومی) ────────
  @Get(":id")
  @UseGuards(OptionalJwtGuard)
  async findOne(@Param("id") id: string, @Req() req: any) {
    // ✅ FIX: جلوگیری از رسیدن رشته‌های غیر UUID به دیتابیس
    if (!isValidUUID(id))
      throw new NotFoundException(`رویداد با شناسه "${id}" پیدا نشد`);
    const event = await this.eventsService.findOne(id);
    // location دقیق فقط برای ادمین‌ها
    if (!isAdminUser(req?.user)) {
      return { ...event, location: undefined };
    }
    return event;
  }

  // ── ایجاد همنشینی (فقط ادمین) ─────────────────────────────────────
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createEventDto: CreateEventDto, @Req() req: any) {
    requireAdmin(req.user);
    return this.eventsService.create({
      ...createEventDto,
      created_by: req.user.id,
    });
  }

  // ── ویرایش همنشینی (فقط ادمین) ────────────────────────────────────
  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @Body() data: Partial<CreateEventDto>,
    @Req() req: any,
  ) {
    requireAdmin(req.user);
    if (!isValidUUID(id))
      throw new BadRequestException("شناسه رویداد معتبر نیست");
    return this.eventsService.update(id, data as any);
  }

  // ── غیرفعال کردن همنشینی (فقط ادمین) ─────────────────────────────
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @Req() req: any) {
    requireAdmin(req.user);
    if (!isValidUUID(id))
      throw new BadRequestException("شناسه رویداد معتبر نیست");
    await this.eventsService.update(id, { is_active: false } as any);
  }

  @Post("send-reminder/:userId")
  @UseGuards(JwtAuthGuard)
  async sendManualReminder(@Param("userId") userId: string, @Req() req: any) {
    requireAdmin(req.user);
    return { success: false, message: "از SmsReminderService استفاده کنید" };
  }
}
