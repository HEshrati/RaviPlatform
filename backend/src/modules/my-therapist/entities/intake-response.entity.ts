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
import { SessionMode } from './therapist-profile.entity';

@Entity('mt_intake_responses')
export class MtIntakeResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', array: true, default: [] })
  concern_topics: string[];

  @Column({ type: 'text', nullable: true })
  custom_concern: string;

  @Column({ type: 'text', default: 'online' })
  preferred_mode: SessionMode;

  @Column({ type: 'text', array: true, default: [] })
  preferred_times: string[];

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ type: 'jsonb', default: {} })
  scale_answers: Record<string, number>;

  @Column({ type: 'bigint', nullable: true })
  budget: number;

  @Column({ length: 20, default: 'any' })
  gender_preference: 'male' | 'female' | 'any';

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
