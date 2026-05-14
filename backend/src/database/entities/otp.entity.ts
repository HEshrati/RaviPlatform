import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('otps')
@Index(['mobileNumber', 'createdAt'])
export class OtpEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'mobile_number' })
  mobileNumber: string;

  @Column()
  code: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ default: false, name: 'is_used' })
  isUsed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
