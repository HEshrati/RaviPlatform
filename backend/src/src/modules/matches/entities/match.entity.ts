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

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  target_user_id: string;

  @Column({ type: 'uuid', nullable: true })
  event_id: string;

  @Column({ type: 'float' })
  compatibility_score: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'int', default: 0 })
  credits_cost: number;

  @Column({ type: 'text', nullable: true })
  match_reason: string;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.initiated_matches)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.received_matches)
  @JoinColumn({ name: 'target_user_id' })
  target_user: User;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
