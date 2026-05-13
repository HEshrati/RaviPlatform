import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type CfsStatus = 'step_topic'|'step_provider'|'step_tests'|'completed'|'abandoned';

@Entity('consultation_flow_sessions')
export class ConsultationFlowSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'text' })
  service_type: 'psychologist' | 'hamzist';

  @Column({ type: 'text', nullable: true })
  topic_slug?: string;

  @Column({ type: 'uuid', nullable: true })
  selected_provider_id?: string;

  @Column({ type: 'text', nullable: true })
  concerns_text?: string;

  @Column({ default: 0 })
  concerns_char_count: number;

  @Column({ type: 'jsonb', default: {} })
  test_answers: Record<string, any>;

  @Column({ type: 'text', default: 'step_topic' })
  status: CfsStatus;

  @Column({ default: false })
  therapist_notified: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  completed_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
