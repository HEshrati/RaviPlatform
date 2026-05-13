import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum CommunicationType {
  INTROVERT = 'introvert',   // درون‌گرا
  EXTROVERT = 'extrovert',   // برون‌گرا
  AMBIVERT = 'ambivert',     // ترکیبی
}

export enum DominantNeed {
  SEEN = 'seen',             // دیده‌شدن
  SECURITY = 'security',     // امنیت
  MEANING = 'meaning',       // معنا
  FUN = 'fun',               // سرگرمی
}

export enum InteractionRhythm {
  ACTIVE = 'active',         // فعال
  CAUTIOUS = 'cautious',     // محتاط
  OBSERVER = 'observer',     // ناظر
}

@Entity('smart_profiles')
export class SmartProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  // ── تیپ ارتباطی (از خوداظهاری + رفتار) ──────────────────────────
  @Column({ type: 'varchar', nullable: true })
  communication_type: CommunicationType | null;

  @Column({ type: 'float', default: 50 })
  introvert_score: number; // 0=extrovert, 100=introvert

  // ── نیاز غالب ──────────────────────────────────────────────────
  @Column({ type: 'varchar', nullable: true })
  dominant_need: DominantNeed | null;

  // ── ریتم تعامل ─────────────────────────────────────────────────
  @Column({ type: 'varchar', nullable: true })
  interaction_rhythm: InteractionRhythm | null;

  // ── سابقه رویدادها ──────────────────────────────────────────────
  @Column({ type: 'int', default: 0 })
  total_events_attended: number;

  @Column({ type: 'int', default: 0 })
  total_events_booked: number;

  @Column({ type: 'float', default: 0 })
  return_rate: number; // نرخ بازگشت

  // ── نرخ عدم حضور (برای ساسپند) ──────────────────────────────────
  @Column({ type: 'int', default: 0 })
  no_show_count: number;

  @Column({ default: false })
  is_suspended: boolean;

  @Column({ type: 'text', nullable: true })
  suspension_reason: string;

  @Column({ type: 'timestamp', nullable: true })
  suspended_at: Date;

  // ── اولویت لوکیشن در ایونت‌ها ───────────────────────────────────
  @Column({ type: 'varchar', nullable: true })
  location_preference: 'neighborhood' | 'city_wide' | null;

  @Column({ type: 'varchar', nullable: true })
  preferred_neighborhood: string;

  // ── رفتار در گروه‌های تلگرامی ──────────────────────────────────
  @Column({ type: 'jsonb', nullable: true })
  telegram_behavior: {
    avg_messages_per_event?: number;
    is_initiator?: boolean;
    is_bridge?: boolean;
    response_time_avg?: number; // seconds
    last_group_activity?: string;
  };

  // ── نیازهای شناسایی‌شده برای رویداد بعدی ─────────────────────
  @Column({ type: 'simple-array', nullable: true })
  next_event_interests: string[]; // سینما، کوه‌نوردی، کافه، ...

  // ── واکنش به گروه‌های مختلف ────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true })
  group_reactions: {
    eventId: string;
    score: number;
    tags: string[];
  }[];

  // ── امتیاز انرژی ────────────────────────────────────────────────
  @Column({ type: 'float', default: 50 })
  energy_level: number; // 0=low, 100=high

  // ── الگوریتم مچینگ: وزن‌های شخصی‌سازی‌شده ─────────────────────
  @Column({ type: 'jsonb', nullable: true })
  matching_weights: {
    age_importance?: number;
    location_importance?: number;
    personality_importance?: number;
  };

  // ── آخرین بروزرسانی توسط AI ─────────────────────────────────────
  @Column({ type: 'timestamp', nullable: true })
  last_ai_update: Date;

  @Column({ type: 'jsonb', nullable: true })
  ai_insights: {
    summary?: string;
    strengths?: string[];
    suggestions?: string[];
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
