import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  target_id: string;

  @Column({ type: 'uuid', nullable: true })
  event_id: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'jsonb', nullable: true })
  behavioral_tags: any;

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({ type: 'timestamp', nullable: true })
  responded_at: Date;

  @Column({ default: false })
  is_anonymous: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.feedbacks_given)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.feedbacks_received)
  @JoinColumn({ name: 'target_id' })
  target: User;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
