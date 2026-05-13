/**
 * SmartProfile Entity — نسخه نهایی یکپارچه‌شده
 * ترکیب هر دو فایل قدیم و جدید
 * مسیر صحیح: src/modules/smart-profile/entities/smart-profile.entity.ts
 */
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
  INTROVERT = 'introvert',
  EXTROVERT = 'extrovert',
  AMBIVERT = 'ambivert',
}

export enum DominantNeed {
  SEEN = 'seen',
  SECURITY = 'security',
  MEANING = 'meaning',
  FUN = 'fun',
  ENTERTAINMENT = 'entertainment',
}

export enum InteractionRhythm {
  ACTIVE = 'active',
  CAUTIOUS = 'cautious',
  OBSERVER = 'observer',
}

@Entity('smart_profiles')
export class SmartProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @Column({ type: 'varchar', nullable: true })
  communication_type: CommunicationType | null;

  @Column({ type: 'float', default: 50 })
  extroversion_score: number;

  get introvert_score(): number {
    return 100 - this.extroversion_score;
  }

  @Column({ type: 'float', default: 50 })
  energy_level: number;

  @Column({ type: 'varchar', nullable: true })
  dominant_need: DominantNeed | null;

  @Column({ type: 'varchar', nullable: true })
  interaction_rhythm: InteractionRhythm | null;

  @Column({ type: 'int', default: 0 })
  total_events_attended: number;

  @Column({ type: 'int', default: 0 })
  total_events_booked: number;

  @Column({ type: 'float', default: 0 })
  return_rate: number;

  @Column({ type: 'int', default: 0 })
  no_show_count: number;

  @Column({ default: false })
  is_suspended: boolean;

  @Column({ type: 'text', nullable: true })
  suspension_reason: string;

  @Column({ type: 'timestamp', nullable: true })
  suspended_at: Date;

  @Column({ default: false })
  suspension_approved_by_admin: boolean;

  @Column({ type: 'varchar', nullable: true })
  location_preference: 'neighborhood' | 'city_wide' | null;

  @Column({ type: 'varchar', nullable: true })
  preferred_neighborhood: string;

  @Column({ type: 'simple-array', nullable: true })
  neighborhood_preferences: string[];

  @Column({ type: 'jsonb', nullable: true })
  telegram_behavior: {
    avg_messages_per_event?: number;
    is_initiator?: boolean;
    is_bridge?: boolean;
    response_time_avg?: number;
    last_group_activity?: string;
  };

  @Column({ type: 'float', nullable: true })
  telegram_message_rate: number;

  @Column({ type: 'float', nullable: true })
  telegram_response_time: number;

  @Column({ type: 'int', nullable: true })
  telegram_messages_sent: number;

  @Column({ type: 'simple-array', nullable: true })
  next_event_interests: string[];

  get extracted_interests(): string[] {
    return this.next_event_interests;
  }

  @Column({ type: 'simple-array', nullable: true })
  preferred_event_types: string[];

  @Column({ type: 'jsonb', nullable: true })
  group_reactions: {
    eventId: string;
    score: number;
    tags: string[];
  }[];

  @Column({ type: 'jsonb', nullable: true })
  group_reaction_history: Record<string, number>;

  @Column({ type: 'float', default: 0 })
  smart_score: number;

  @Column({ type: 'float', default: 0 })
  avg_match_satisfaction: number;

  @Column({ type: 'jsonb', nullable: true })
  matching_weights: {
    age_importance?: number;
    location_importance?: number;
    personality_importance?: number;
  };

  @Column({ type: 'timestamp', nullable: true })
  last_ai_update: Date;

  @Column({ type: 'jsonb', nullable: true })
  ai_insights: {
    summary?: string;
    strengths?: string[];
    suggestions?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  test_results_summary: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  last_event_attended_at: Date;

  // ✅ اضافه شد — برای ردیابی آخرین یادآوری SMS
  @Column({ type: 'timestamp', nullable: true })
  last_reminder_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
