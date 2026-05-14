import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('quiz_results')
export class QuizResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  quiz_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  event_id: string;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'int' })
  total_questions: number;

  @Column({ type: 'jsonb' })
  answers: number[];

  @CreateDateColumn()
  completed_at: Date;
}
