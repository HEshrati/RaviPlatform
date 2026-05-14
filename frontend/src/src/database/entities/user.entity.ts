import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true, name: 'password_hash' })
  passwordHash?: string;

  get password_hash(): string {
    return this.passwordHash;
  }

  @Column({ unique: true, nullable: true, name: 'phone_number' })
  mobileNumber?: string;

  get phone_number(): string {
    return this.mobileNumber;
  }

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: false, name: 'is_test_taken' })
  isTestTaken: boolean;

  @Column({ type: 'bigint', unique: true, nullable: true })
  telegram_id?: string;

  @Column({ nullable: true })
  telegram_username?: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 0 })
  credits_balance: number;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  get is_verified(): boolean {
    return this.isVerified;
  }

  @Column({ default: false, name: 'is_banned' })
  isBanned: boolean;

  get is_banned(): boolean {
    return this.isBanned;
  }

  @Column({ default: 0, name: 'warning_count' })
  warningCount: number;

  @Column({ type: 'text', nullable: true, name: 'ban_reason' })
  banReason?: string;

  @Column({ default: 'onboarding' })
  current_fsm_state: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login' })
  lastLogin?: Date;

  get last_login(): Date {
    return this.lastLogin;
  }

  @Column({ default: 0, name: 'login_count' })
  loginCount: number;

  get login_count(): number {
    return this.loginCount;
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  get created_at(): Date {
    return this.createdAt;
  }

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // ===== Relations =====
  @OneToOne('Profile', 'user', { cascade: true })
  profile: any;

  @OneToMany('Booking', 'user')
  bookings: any[];

  @OneToMany('Payment', 'user')
  payments: any[];

  @OneToMany('Match', 'user')
  initiated_matches: any[];

  @OneToMany('Match', 'target_user')
  received_matches: any[];

  @OneToMany('Message', 'sender')
  messages: any[];

  @OneToMany('Feedback', 'user')
  feedbacks_given: any[];

  @OneToMany('Feedback', 'target')
  feedbacks_received: any[];
}
