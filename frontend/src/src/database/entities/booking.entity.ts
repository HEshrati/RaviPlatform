import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  service: string;

  @Column({ type: 'timestamp', name: 'booking_date' })
  bookingDate: Date;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true, name: 'cancellation_reason' })
  cancellationReason?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'cancelled_at' })
  cancelledAt?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'amount_paid' })
  amountPaid?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
