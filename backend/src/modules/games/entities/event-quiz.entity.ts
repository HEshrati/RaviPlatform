import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  image_url?: string;
  image_keyword?: string;
}

export type GameType = 'icebreaker' | 'quiz' | 'ravi_frame';

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

  @Column({ type: 'varchar', default: 'icebreaker' })
  game_type: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: { timer_seconds?:number; allow_skip?:boolean; show_images?:boolean; rotation_mode?:string };

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
