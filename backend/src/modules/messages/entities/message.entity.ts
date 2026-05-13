import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  conversation_id: string;

  @Column({ type: 'uuid' })
  sender_id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  attachment_url: string;

  @Column({ default: false })
  is_encrypted: boolean;

  @Column({ default: false })
  is_system_message: boolean;

  @Column({ type: 'timestamp', nullable: true })
  edited_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  reactions: any;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;
}
