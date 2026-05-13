import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('match_groups')
export class MatchGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  event_id: string;

  @Column({ type: 'int' })
  group_index: number;

  @Column({ nullable: true })
  group_name: string;

  @Column({ type: 'jsonb', default: [] })
  member_ids: string[];

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  compatibility_score: number;

  @Column({ type: 'jsonb', default: [] })
  match_reasons: string[];

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
