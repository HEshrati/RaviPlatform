import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ContentStatus {
  DRAFT = 'draft',           // پیش‌نویس - نیاز به تایید ادمین
  PUBLISHED = 'published',   // منتشرشده
  REJECTED = 'rejected',     // رد شده
  ARCHIVED = 'archived',     // آرشیو
}

@Entity('ai_contents')
export class AiContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ nullable: true })
  topic: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({ default: true })
  ai_generated: boolean;

  @Column({ type: 'int', nullable: true })
  reading_time_minutes: number;

  @Column({ type: 'int', default: 0 })
  view_count: number;

  @Column({ type: 'int', default: 0 })
  like_count: number;

  @Column({ type: 'uuid', nullable: true })
  approved_by: string;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string;

  @Column({ type: 'text', nullable: true })
  cover_image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
