import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('consultation_topics')
export class ConsultationTopic {
  @PrimaryColumn()
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: '🧠' })
  icon: string;

  @Column({ type: 'text', array: true, default: ['psychologist', 'hamzist'] })
  service_types: string[];

  @Column({ type: 'text', array: true, default: [] })
  required_tests: string[];

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: 0 })
  sort_order: number;

  @CreateDateColumn()
  created_at: Date;
}
