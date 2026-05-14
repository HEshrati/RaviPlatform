/**
 * Entity: CrmAiAlert
 * هشدارهایی که هوش مصنوعی از تحلیل رفتار کاربران تولید می‌کند
 * مسیر: src/modules/crm/entities/crm-ai-alert.entity.ts
 */
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

export enum AlertType {
  ANOMALY          = 'anomaly',          // رفتار غیرعادی
  CHURN_RISK       = 'churn_risk',       // خطر ریزش کاربر
  PAYMENT_ISSUE    = 'payment_issue',    // مشکل در پرداخت
  HIGH_ERROR_RATE  = 'high_error_rate',  // نرخ بالای خطا
  BOOKING_DROP     = 'booking_drop',     // افت رزرو
  SUSPICIOUS       = 'suspicious',       // رفتار مشکوک
  PERFORMANCE      = 'performance',      // مشکل عملکردی API
  ENGAGEMENT_LOW   = 'engagement_low',  // تعامل پایین
  POSITIVE_TREND   = 'positive_trend',  // روند مثبت (اطلاع‌رسانی)
}

export enum AlertStatus {
  OPEN     = 'open',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
  IGNORED  = 'ignored',
}

export enum AlertSeverity {
  LOW      = 'low',
  MEDIUM   = 'medium',
  HIGH     = 'high',
  CRITICAL = 'critical',
}

@Entity('crm_ai_alerts')
@Index(['status', 'created_at'])
@Index(['alert_type', 'severity'])
export class CrmAiAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  alert_type: AlertType;

  @Column({ type: 'varchar', length: 20, default: AlertSeverity.MEDIUM })
  severity: AlertSeverity;

  @Column({ type: 'varchar', length: 20, default: AlertStatus.OPEN })
  status: AlertStatus;

  /** عنوان کوتاه هشدار (تولیدشده توسط AI) */
  @Column({ type: 'varchar' })
  title: string;

  /** تحلیل کامل AI */
  @Column({ type: 'text' })
  ai_analysis: string;

  /** پیشنهاد اقدام از AI */
  @Column({ type: 'text', nullable: true })
  recommendation: string | null;

  /** داده‌های خام که AI تحلیل کرده */
  @Column({ type: 'jsonb', nullable: true })
  raw_data: Record<string, any> | null;

  /** کاربر مرتبط (اگر هشدار به یک کاربر خاص مربوط باشد) */
  @Column({ type: 'uuid', nullable: true })
  related_user_id: string | null;

  /** امتیاز خطر: 0-100 */
  @Column({ type: 'float', default: 0 })
  risk_score: number;

  /** یادداشت ادمین هنگام بررسی */
  @Column({ type: 'text', nullable: true })
  admin_note: string | null;

  /** ادمینی که هشدار را بررسی کرده */
  @Column({ type: 'uuid', nullable: true })
  reviewed_by: string | null;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
