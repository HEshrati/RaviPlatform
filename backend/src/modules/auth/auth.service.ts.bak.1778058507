import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcryptjs';

const OTP_API_KEY = process.env.OTP_API_KEY || '';
const OTP_TEMPLATE_ID = parseInt(process.env.OTP_TEMPLATE_ID || '100000');
const IS_DEV = process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEV_OTP === 'true';

// OTP store with rate limiting: tracks OTP code + request count
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number; lastRequest: number }>();
const OTP_MAX_ATTEMPTS = 5; // max wrong guesses
const OTP_RATE_LIMIT_MS = 60_000; // 1 minute between requests

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string; dev_code?: string }> {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^09\d{9}$/.test(cleanPhone)) {
      throw new BadRequestException('Invalid phone number. Example: 09123456789');
    }

    // Rate limit: prevent spam requests
    const existing = otpStore.get(cleanPhone);
    if (existing && Date.now() - existing.lastRequest < OTP_RATE_LIMIT_MS) {
      const wait = Math.ceil((OTP_RATE_LIMIT_MS - (Date.now() - existing.lastRequest)) / 1000);
      throw new BadRequestException(`لطفاً ${wait} ثانیه صبر کنید`);
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(cleanPhone, {
      code: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      lastRequest: Date.now(),
    });

    // DEV MODE: skip SMS, return code directly
    if (IS_DEV) {
      console.log(`[DEV OTP] Phone: ${cleanPhone} => Code: ${otpCode}`);
      return {
        message: 'OTP sent (DEV mode - check console or dev_code field)',
        dev_code: otpCode,
      };
    }

    // PRODUCTION: send real SMS
    try {
      const response = await fetch('https://api.sms.ir/v1/send/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': OTP_API_KEY },
        body: JSON.stringify({
          mobile: cleanPhone,
          templateId: OTP_TEMPLATE_ID,
          parameters: [{ name: 'Code', value: otpCode }],
        }),
      });
      if (!response.ok) {
        const err = (await response.json()) as any;
        throw new Error(err?.message || 'SMS send failed');
      }
    } catch (error) {
      otpStore.delete(cleanPhone);
      throw new BadRequestException('Failed to send OTP: ' + error.message);
    }

    return { message: 'OTP code sent successfully' };
  }

  async verifyOtp(phone: string, code: string, name?: string): Promise<{ access_token: string; user: any }> {
    const cleanPhone = phone.replace(/\D/g, '');
    const stored = otpStore.get(cleanPhone);

    if (!stored) throw new BadRequestException('OTP expired or not sent');
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(cleanPhone);
      throw new BadRequestException('OTP expired');
    }

    // Brute-force protection
    stored.attempts = (stored.attempts || 0) + 1;
    if (stored.attempts > OTP_MAX_ATTEMPTS) {
      otpStore.delete(cleanPhone);
      throw new BadRequestException('تعداد تلاش‌ها از حد مجاز گذشت. لطفاً کد جدید دریافت کنید');
    }

    if (stored.code !== code) throw new BadRequestException('کد وارد شده اشتباه است');

    otpStore.delete(cleanPhone);

    let user = await this.userRepository.findOne({ where: { mobileNumber: cleanPhone } });
    if (!user) {
      // بررسی نام+فامیل تکراری
      if (name && name.trim()) {
        const nameTrimmed = name.trim().replace(/\s+/g, ' ');
        const nameExists = await this.userRepository.findOne({ where: { name: nameTrimmed } });
        if (nameExists) {
          throw new BadRequestException('این نام و نام خانوادگی قبلاً ثبت شده است. لطفاً نام دیگری انتخاب کنید.');
        }
      }
      user = this.userRepository.create({ mobileNumber: cleanPhone, isVerified: true, role: 'user', name: name ? name.trim() : '' });
      await this.userRepository.save(user);
    } else {
      user.isVerified = true;
      if (name && !user.name) user.name = name;
      await this.userRepository.save(user);
    }

    const access_token = this.jwtService.sign({
      userId: user.id,
      mobileNumber: user.mobileNumber,
      role: user.role,
    });

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name || '',
        mobileNumber: user.mobileNumber,
        avatar: user.avatar,
        role: user.role,
        isTestTaken: user.isTestTaken || false,
        // Profile is complete when user has name (city is checked client-side via AppContext)
        isProfileComplete: !!(user.name && user.name.trim()),
      },
    };
  }

  async register(dto: { email?: string; mobileNumber?: string; password?: string }) {
    const { email, mobileNumber, password } = dto;
    const where: any[] = [];
    if (email) where.push({ email });
    if (mobileNumber) where.push({ mobileNumber });

    const existing = where.length > 0 ? await this.userRepository.findOne({ where }) : null;
    if (existing) throw new BadRequestException('User already registered');

    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const user = this.userRepository.create({ email, mobileNumber, passwordHash, isVerified: false, role: 'user' });
    await this.userRepository.save(user);

    return {
      access_token: this.jwtService.sign({ userId: user.id, email: user.email, role: user.role }),
      user,
    };
  }

  async login(dto: { identifier: string; password: string }) {
    const { identifier, password } = dto;
    const isEmail = identifier.includes('@');
    const user = await this.userRepository.findOne({
      where: isEmail ? { email: identifier } : { mobileNumber: identifier },
    });

    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return {
      access_token: this.jwtService.sign({ userId: user.id, email: user.email, role: user.role }),
      user,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return {
      id: user.id,
      name: user.name || '',
      mobileNumber: user.mobileNumber,
      avatar: user.avatar,
      role: user.role,
      isTestTaken: user.isTestTaken || false,
      isProfileComplete: !!user.name,
    };
  }

  async markTestTaken(userId: string) {
    await this.userRepository.update(userId, { isTestTaken: true });
    return { success: true };
  }

  async validateUser(userId: string) {
    return this.userRepository.findOne({ where: { id: userId } });
  }
  async checkPhoneExists(phone: string): Promise<boolean> {
    const clean = phone.replace(/\D/g, '');
    const user = await this.userRepository.findOne({ where: { mobileNumber: clean } });
    return !!user;
  }


  // بررسی تکراری بودن نام+فامیل
  async checkNameExists(name: string): Promise<boolean> {
    if (!name || !name.trim()) return false;
    const normalized = name.trim().replace(/\s+/g, ' ');
    const user = await this.userRepository.findOne({ where: { name: normalized } });
    return !!user;
  }



}
