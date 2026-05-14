import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/entities/user.entity';

export enum CommunicationType {
  INTROVERT = 'introvert',       // درون‌گرا
  EXTROVERT = 'extrovert',       // برون‌گرا
  AMBIVERT = 'ambivert',         // ترکیبی
}

export enum DominantNeed {
  SEEN = 'seen',                 // دیده‌شدن
  SECURITY = 'security',         // امنیت
  MEANING = 'meaning',           // معنا
  ENTERTAINMENT = 'entertainment', // سرگرمی
}

export enum InteractionRhythm {
  ACTIVE = 'active',             // فعال
  CAUTIOUS = 'cautious',         // محتاط
  OBSERVER = 'observer',         // ناظر
}

@Entity('smart_profiles')
export class SmartProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  // ── تیپ ارتباطی ─────────────────────────────────────────────────
  @Column({
    type: 'enum',
    enum: CommunicationType,
    nullable: true,
  })
  communication_type: CommunicationType;

  // ── نیاز غالب ────────────────────────────────────────────────────
  @Column({
    type: 'enum',
    enum: DominantNeed,
    nullable: true,
  })
  dominant_need: DominantNeed;

  // ── ریتم تعامل ───────────────────────────────────────────────────
  @Column({
    type: 'enum',
    enum: InteractionRhythm,
    nullable: true,
  })
  interaction_rhythm: InteractionRhythm;

  // ── امتیازهای محاسبه‌شده (0-100) ──────────────────────────────────
  @Column({ type: 'float', default: 50 })
  extroversion_score: number;   // 0 = کاملاً درون‌گرا، 100 = کاملاً برون‌گرا

  @Column({ type: 'float', default: 50 })
  energy_level: number;         // بر اساس میزان مشارکت در گروه‌ها

  @Column({ type: 'float', default: 0 })
  return_rate: number;          // نرخ بازگشت (0-100)

  // ── سابقه رویدادها ───────────────────────────────────────────────
  @Column({ type: 'int', default: 0 })
  total_events_attended: number;

  @Column({ type: 'int', default: 0 })
  total_events_registered: number;

  @Column({ type: 'int', default: 0 })
  no_show_count: number;         // دفعات عدم حضور

  // ── واکنش به گروه‌های مختلف ──────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true })
  group_reaction_history: Record<string, number>; // { groupId: satisfactionScore }

  // ── نیازهای استخراج‌شده از تعاملات ──────────────────────────────
  @Column({ type: 'simple-array', nullable: true })
  extracted_interests: string[]; // استخراج از تلگرام + سایت + نظرسنجی

  @Column({ type: 'simple-array', nullable: true })
  preferred_event_types: string[]; // سینما/کوه/کافه/...

  // ── داده‌های تلگرام ───────────────────────────────────────────────
  @Column({ type: 'float', nullable: true })
  telegram_message_rate: number;    // نرخ پیام در گروه‌ها

  @Column({ type: 'float', nullable: true })
  telegram_response_time: number;   // میانگین زمان پاسخ (دقیقه)

  @Column({ type: 'int', nullable: true })
  telegram_messages_sent: number;

  // ── اولویت‌بندی مکان ─────────────────────────────────────────────
  @Column({ type: 'simple-array', nullable: true })
  neighborhood_preferences: string[];  // اولویت محله‌ها

  @Column({ default: 'neighborhood' })
  location_preference: string;         // neighborhood / citywide

  // ── سابقه مچ‌ها ──────────────────────────────────────────────────
  @Column({ type: 'float', default: 0 })
  avg_match_satisfaction: number;   // میانگین رضایت از مچ‌ها

  // ── نتایج تست‌ها ──────────────────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true })
  test_results_summary: Record<string, any>;

  // ── امتیاز هوشمند کلی ──────────────────────────────────────────
  @Column({ type: 'float', default: 0 })
  smart_score: number;              // امتیاز کلی هوشمند برای مچینگ بهتر

  // ── وضعیت ────────────────────────────────────────────────────────
  @Column({ default: false })
  is_suspended: boolean;            // ساسپند شده (2 بار عدم حضور)

  @Column({ type: 'text', nullable: true })
  suspension_reason: string;

  @Column({ type: 'timestamp', nullable: true })
  suspended_at: Date;

  @Column({ default: false })
  suspension_approved_by_admin: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_event_attended_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
