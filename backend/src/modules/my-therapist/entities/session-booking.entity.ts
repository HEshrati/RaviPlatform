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
import { TherapistProfile, SessionMode } from './therapist-profile.entity';
import { SupportGroup } from './support-group.entity';

@Entity('therapy_session_bookings')
export class TherapySessionBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  therapist_id: string;

  @ManyToOne(() => TherapistProfile)
  @JoinColumn({ name: 'therapist_id' })
  therapist: TherapistProfile;

  @Column({ length: 50, nullable: true })
  slot_date: string;

  @Column({ length: 20, nullable: true })
  slot_time: string;

  @Column({ type: 'timestamptz', nullable: true })
  scheduled_at: Date;

  @Column({ type: 'text', default: 'online' })
  mode: SessionMode;

  @Column({ length: 30, default: 'pending' })
  status:
    | 'pending'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'no_show';

  @Column({ length: 30, default: 'pending' })
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';

  @Column({ type: 'bigint', nullable: true })
  amount: number;

  @Column({ length: 200, nullable: true })
  payment_ref: string;

  @Column({ type: 'text', nullable: true })
  cancellation_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('support_group_memberships')
export class SupportGroupMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  group_id: string;

  @ManyToOne(() => SupportGroup)
  @JoinColumn({ name: 'group_id' })
  group: SupportGroup;

  @Column({ length: 30, default: 'pending' })
  status:
    | 'pending'
    | 'active'
    | 'left'
    | 'removed'
    | 'on_waitlist';

  @Column({ length: 30, default: 'pending' })
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';

  @Column({ type: 'bigint', nullable: true })
  amount: number;

  @Column({ length: 200, nullable: true })
  payment_ref: string;

  @Column({ type: 'timestamptz', nullable: true })
  joined_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  left_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
