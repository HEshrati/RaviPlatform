/**
 * Entity: UserBehaviorEvent
 * هر رفتار کاربر در سایت — کلیک، بازدید، رزرو، خطا — اینجا ثبت می‌شود
 * مسیر: src/modules/crm/entities/user-behavior-event.entity.ts
 */
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, Index, ManyToOne, JoinColumn,
} from 'typeorm';

export enum BehaviorEventType {
  // ── ناوبری ──────────────────────────────────────────────────────
  PAGE_VIEW         = 'page_view',
  PAGE_EXIT         = 'page_exit',

  // ── احراز هویت ──────────────────────────────────────────────────
  LOGIN             = 'login',
  LOGOUT            = 'logout',
  REGISTER          = 'register',
  OTP_REQUEST       = 'otp_request',

  // ── رویدادها ────────────────────────────────────────────────────
  EVENT_VIEW        = 'event_view',
  EVENT_SEARCH      = 'event_search',
  EVENT_FILTER      = 'event_filter',

  // ── رزرو ────────────────────────────────────────────────────────
  BOOKING_START     = 'booking_start',
  BOOKING_COMPLETE  = 'booking_complete',
  BOOKING_CANCEL    = 'booking_cancel',
  BOOKING_ABANDON   = 'booking_abandon',

  // ── پرداخت ──────────────────────────────────────────────────────
  PAYMENT_START     = 'payment_start',
  PAYMENT_SUCCESS   = 'payment_success',
  PAYMENT_FAIL      = 'payment_fail',

  // ── پروفایل ─────────────────────────────────────────────────────
  PROFILE_VIEW      = 'profile_view',
  PROFILE_EDIT      = 'profile_edit',
  TEST_COMPLETE     = 'test_complete',

  // ── محتوا ───────────────────────────────────────────────────────
  ARTICLE_VIEW      = 'article_view',

  // ── پشتیبانی ────────────────────────────────────────────────────
  SUPPORT_SUBMIT    = 'support_submit',

  // ── خطا ─────────────────────────────────────────────────────────
  API_ERROR         = 'api_error',
  ERROR_404         = 'error_404',

  // ── API (ثبت خودکار توسط Interceptor) ──────────────────────────
  API_CALL          = 'api_call',
}

export enum EventSeverity {
  INFO    = 'info',
  WARNING = 'warning',
  ERROR   = 'error',
}

@Entity('crm_user_behavior_events')
@Index(['user_id', 'created_at'])
@Index(['event_type', 'created_at'])
@Index(['session_id'])
export class UserBehaviorEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** null = کاربر مهمان */
  @Column({ type: 'uuid', nullable: true })
  @Index()
  user_id: string | null;

  @Column({ type: 'varchar', length: 100 })
  event_type: BehaviorEventType;

  @Column({ type: 'varchar', length: 20, default: EventSeverity.INFO })
  severity: EventSeverity;

  /** صفحه‌ای که کاربر در آن بوده */
  @Column({ type: 'varchar', nullable: true })
  page_path: string | null;

  /** endpoint فراخوانی‌شده (برای api_call) */
  @Column({ type: 'varchar', nullable: true })
  api_endpoint: string | null;

  /** کد HTTP پاسخ */
  @Column({ type: 'int', nullable: true })
  http_status: number | null;

  /** مدت زمان پاسخ به میلی‌ثانیه */
  @Column({ type: 'int', nullable: true })
  response_time_ms: number | null;

  /** شناسه session مرورگر */
  @Column({ type: 'varchar', nullable: true })
  session_id: string | null;

  /** IP کاربر */
  @Column({ type: 'varchar', nullable: true })
  ip_address: string | null;

  /** User-Agent مرورگر */
  @Column({ type: 'varchar', nullable: true })
  user_agent: string | null;

  /** اطلاعات اضافی: eventId، bookingId، errorMessage، ... */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
