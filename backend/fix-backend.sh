#!/bin/bash
# ============================================
# 🔧 Raavi Backend - Full Fix Script
# از root پروژه اجرا کن (کنار پوشه backend)
# chmod +x fix-backend.sh && ./fix-backend.sh
# ============================================

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${GREEN}✅ $1${NC}"; }
info() { echo -e "${YELLOW}🔧 $1${NC}"; }
head() { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n${BLUE}  $1${NC}\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

[ ! -d "./backend" ] && echo "❌ از root پروژه اجرا کن!" && exit 1

# ============================================
head "1/6 - یکپارچه‌سازی User Entity (دو entity متضاد!)"
# ============================================
# مشکل: database/entities/user.entity.ts با modules/users/entities/user.entity.ts تضاد دارن
# راه‌حل: یک entity واحد با تمام فیلدها

cat > backend/src/database/entities/user.entity.ts << 'EOF'
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true, name: 'password_hash' })
  passwordHash?: string;

  // برای سازگاری با users.service.ts
  get password_hash(): string { return this.passwordHash; }

  @Column({ unique: true, nullable: true, name: 'phone_number' })
  mobileNumber?: string;

  // برای سازگاری با users.service.ts
  get phone_number(): string { return this.mobileNumber; }

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

  get is_verified(): boolean { return this.isVerified; }

  @Column({ default: false, name: 'is_banned' })
  isBanned: boolean;

  get is_banned(): boolean { return this.isBanned; }

  @Column({ default: 'onboarding' })
  current_fsm_state: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login' })
  lastLogin?: Date;

  get last_login(): Date { return this.lastLogin; }

  @Column({ default: 0, name: 'login_count' })
  loginCount: number;

  get login_count(): number { return this.loginCount; }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  get created_at(): Date { return this.createdAt; }

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
EOF
log "database/entities/user.entity.ts یکپارچه شد"

# ============================================
head "2/6 - users/entities/user.entity.ts (اشاره به همان entity)"
# ============================================

cat > backend/src/modules/users/entities/user.entity.ts << 'EOF'
// این فایل از entity اصلی re-export می‌کند تا تضاد نباشه
export { User } from '../.././../database/entities/user.entity';
EOF
log "users/entities/user.entity.ts به entity اصلی اشاره می‌کنه"

# ============================================
head "3/6 - jwt.strategy.ts (payload.sub → payload.userId)"
# ============================================
# مشکل: JWT با userId امضا میشه ولی strategy دنبال sub میگرده

cat > backend/src/modules/auth/strategies/jwt.strategy.ts << 'EOF'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // payload.userId (نه payload.sub)
    const userId = payload.userId || payload.sub;
    if (!userId) throw new UnauthorizedException('توکن نامعتبر است');

    const user = await this.usersService.findById(userId);

    if (!user) throw new UnauthorizedException('کاربر یافت نشد');
    if (user.is_banned) throw new UnauthorizedException('حساب کاربری مسدود شده است');

    return { id: user.id, email: user.email, role: user.role };
  }
}
EOF
log "jwt.strategy.ts اصلاح شد (payload.userId)"

# ============================================
head "4/6 - users.service.ts (سازگار با entity جدید)"
# ============================================

cat > backend/src/modules/users/users.service.ts << 'EOF'
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: { email?: string; mobileNumber?: string; password?: string }): Promise<User> {
    if (data.email) {
      const existing = await this.findByEmail(data.email);
      if (existing) throw new ConflictException('این ایمیل قبلاً ثبت شده است');
    }

    const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : undefined;
    const user = this.usersRepository.create({
      email: data.email,
      mobileNumber: data.mobileNumber,
      passwordHash,
    });

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('کاربر پیدا نشد');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { mobileNumber: phone } });
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = await this.findById(id);
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await this.usersRepository.save(user);
  }
}
EOF
log "users.service.ts اصلاح شد"

# ============================================
head "5/6 - main.ts (CORS + پورت)"
# ============================================
# مشکل: CORS فقط localhost:3001 رو قبول می‌کنه ولی frontend روی 3000 هست

cat > backend/src/main.ts << 'EOF'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - هر دو پورت رو قبول می‌کنه
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL || 'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // false تا فیلدهای اضافی ارور ندن
      transform: true,
    }),
  );

  const port = parseInt(process.env.PORT || '4000', 10);
  await app.listen(port);
  console.log(`✅ Backend running on: http://localhost:${port}`);
}

bootstrap();
EOF
log "main.ts اصلاح شد (CORS + پورت 4000)"

# ============================================
head "6/6 - .env (پاک‌سازی PORT تکراری)"
# ============================================

# حذف PORT تکراری
if [ -f "backend/.env" ]; then
  # حذف همه PORT ها و اضافه کردن یکی
  grep -v "^PORT=" backend/.env > backend/.env.tmp
  echo "PORT=4000" >> backend/.env.tmp
  mv backend/.env.tmp backend/.env

  # اصلاح FRONTEND_URL
  sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=http://localhost:3000|' backend/.env

  log ".env اصلاح شد (PORT تکراری حذف شد)"
fi

# ============================================
echo -e "\n${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ تمام مشکلات backend رفع شد!         ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}\n"
echo "📌 مشکلات رفع‌شده:"
echo "  1️⃣  دو User Entity متضاد → یکپارچه شدن"
echo "  2️⃣  email nullable نبود → اصلاح شد"
echo "  3️⃣  payload.sub → payload.userId در JWT"
echo "  4️⃣  CORS فقط 3001 → الان 3000 و 3001 هر دو"
echo "  5️⃣  PORT تکراری در .env → اصلاح شد"
echo "  6️⃣  users.service سازگار با entity جدید شد"
echo ""
echo "🚀 اجرا:"
echo "  cd backend && npm run start:dev"
echo ""
echo "🧪 تست:"
echo "  curl -X POST http://localhost:4000/api/auth/request-otp \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"phone\":\"09123456789\"}'"