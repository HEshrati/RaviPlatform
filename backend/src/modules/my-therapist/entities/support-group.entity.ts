import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TherapistProfile, SessionMode } from './therapist-profile.entity';

export type ConfidentialityLevel = 'high' | 'medium' | 'standard';

@Entity('support_groups')
export class SupportGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200 })
  topic: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid' })
  facilitator_id: string;

  @ManyToOne(() => TherapistProfile)
  @JoinColumn({ name: 'facilitator_id' })
  facilitator: TherapistProfile;

  @Column({ length: 200 })
  schedule: string;

  @Column({ length: 20, nullable: true })
  schedule_weekday: string;

  @Column({ length: 10, nullable: true })
  schedule_time: string;

  @Column({ type: 'text', default: 'online' })
  mode: SessionMode;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'int', default: 0 })
  members_count: number;

  @Column({ type: 'bigint' })
  price_per_month: number;

  @Column({ length: 20, default: 'standard' })
  confidentiality_level: ConfidentialityLevel;

  @Column({ type: 'text', array: true, default: [] })
  rules: string[];

  @Column({ length: 500, nullable: true })
  image_url: string;

  @Column({ length: 30, default: 'active' })
  status: 'active' | 'closed' | 'archived';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
