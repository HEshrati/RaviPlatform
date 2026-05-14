import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  event_type: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'int', default: 0 })
  current_bookings: number;

  @Column({ type: 'float', default: 0.7 })
  min_match_score: number;

  @Column({ type: 'int', default: 6 })
  max_group_size: number;

  @Column({ type: 'int', default: 3 })
  min_group_size: number;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp' })
  end_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  registration_deadline: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: 'IRR' })
  currency: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: false })
  is_online: boolean;

  @Column({ nullable: true })
  meeting_link: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  instructor_name: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'text', array: true, nullable: true })
  features: string[];

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_featured: boolean;

  /** در صورت ادغام، ID ایونت مقصد */
  @Column({ type: 'uuid', nullable: true })
  merged_into: string;

  @Column({ type: 'timestamp', nullable: true })
  merged_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true, name: 'created_by' })
  created_by: string;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}
