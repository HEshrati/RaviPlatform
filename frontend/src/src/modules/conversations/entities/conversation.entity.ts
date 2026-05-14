import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Message } from '../../messages/entities/message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_a: string;

  @Column({ type: 'uuid', nullable: true })
  user_b: string;

  @Column({ type: 'uuid', nullable: true })
  group_id: string;

  @Column({ type: 'uuid', nullable: true })
  event_id: string;

  @Column()
  conversation_type: string;

  @Column({ type: 'timestamp', nullable: true })
  last_message_at: Date;

  @Column({ default: false })
  is_archived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  archived_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
