import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

@Entity('event_quizzes')
export class EventQuiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  event_id: string;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  questions: QuizQuestion[];

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
