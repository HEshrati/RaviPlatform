import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type SessionMode = 'online' | 'in_person';

@Entity('therapist_profiles')
export class TherapistProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 500, nullable: true })
  avatar_url: string;

  @Column({ type: 'text', array: true, default: [] })
  credentials: string[];

  @Column({ type: 'text', array: true, default: [] })
  specialties: string[];

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'int', default: 0 })
  years_of_experience: number;

  @Column({ type: 'bigint' })
  price_per_session: number;

  @Column({ type: 'text', array: true, default: ['online'] })
  modes: SessionMode[];

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviews_count: number;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ length: 50, default: 'pending' })
  verification_status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'text', nullable: true })
  verification_notes: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
