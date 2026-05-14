import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TicketStatus {
  OPEN = 'open',
  AI_ANSWERED = 'ai_answered',
  PENDING_HUMAN = 'pending_human',
  CLOSED = 'closed',
}

export enum TicketCategory {
  BOOKING = 'booking',
  PAYMENT = 'payment',
  TECHNICAL = 'technical',
  EVENT = 'event',
  ACCOUNT = 'account',
  OTHER = 'other',
}

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column({ type: 'varchar', nullable: true })
  category: TicketCategory;

  // پاسخ AI
  @Column({ type: 'text', nullable: true })
  ai_response: string;

  @Column({ default: false })
  ai_resolved: boolean;

  // پاسخ ادمین
  @Column({ type: 'text', nullable: true })
  admin_response: string;

  @Column({ nullable: true })
  assigned_to: string;

  @Column({ type: 'timestamp', nullable: true })
  resolved_at: Date;

  // اطلاعات تماس (اگر کاربر لاگین نباشد)
  @Column({ nullable: true })
  contact_phone: string;

  @Column({ nullable: true })
  contact_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
