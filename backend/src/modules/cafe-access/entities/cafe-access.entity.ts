import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('cafe_access')
export class CafeAccess {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) username: string;
  @Column() password_hash: string;
  @Column() cafe_name: string;
  @Column({ nullable: true }) city: string;
  @Column({ nullable: true }) address: string;
  @Column({ type: 'varchar', default: 'medium' }) price_tier: string;
  @Column({ default: true }) is_active: boolean;
  @Column({ nullable: true, unique: true }) telegram_id: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
