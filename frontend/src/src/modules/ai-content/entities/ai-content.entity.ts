import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ContentStatus {
  DRAFT = 'draft',           // پیش‌نویس (تولید شده توسط AI)
  PENDING = 'pending',       // در انتظار تأیید ادمین
  PUBLISHED = 'published',   // منتشر شده
  REJECTED = 'rejected',     // رد شده
}

export enum ContentCategory {
  ATTACHMENT = 'attachment',         // سبک‌های دلبستگی
  COMMUNICATION = 'communication',   // ارتباط مؤثر
  EMOTION = 'emotion',               // هوش هیجانی
  SOCIAL = 'social',                 // مهارت‌های اجتماعی
  PSYCHOLOGY = 'psychology',         // روان‌شناسی عمومی
  RELATIONSHIP = 'relationship',     // روابط انسانی
}

@Entity('ai_content')
export class AiContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'varchar', default: ContentStatus.DRAFT })
  status: ContentStatus;

  @Column({ type: 'varchar', nullable: true })
  category: ContentCategory;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ nullable: true })
  source_reference: string; // منبع (مثلاً Nature)

  @Column({ type: 'text', nullable: true })
  admin_note: string; // یادداشت ادمین هنگام تأیید/رد

  @Column({ nullable: true })
  reviewed_by: string; // ID ادمین

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'int', default: 0 })
  view_count: number;

  @Column({ type: 'int', default: 0 })
  like_count: number;

  // داده‌های SEO
  @Column({ nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  meta_description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
