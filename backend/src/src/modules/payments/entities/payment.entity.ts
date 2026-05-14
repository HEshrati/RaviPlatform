import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { User } from '../../users/entities/user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  booking_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'IRR' })
  currency: string;

  @Column()
  payment_method: string;

  @Column({ nullable: true })
  payment_gateway: string;

  @Column({ nullable: true })
  gateway_transaction_id: string;

  @Column({ nullable: true })
  gateway_reference: string;

  @Column({ nullable: true })
  gateway_tracking_code: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  refunded_at: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refund_amount: number;

  @Column({ type: 'text', nullable: true })
  refund_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
