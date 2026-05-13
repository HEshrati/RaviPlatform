import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcryptjs';

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

  async getUserStats(userId: string) {
    const user = await this.findById(userId);
    return {
      id: user.id,
      name: user.name || '',
      mobileNumber: user.mobileNumber,
      loginCount: user.loginCount || 0,
      lastLogin: user.lastLogin,
      isTestTaken: user.isTestTaken || false,
      createdAt: user.createdAt,
    };
  }

  /**
   * PATCH /api/users/me — update user name / avatar
   * Fixes "profile data not saving in dev mode" bug by persisting name to DB
   */
  async updateUser(id: string, data: { name?: string; avatar?: string }): Promise<any> {
    const user = await this.findById(id);
    if (data.name !== undefined && data.name.trim()) {
      user.name = data.name.trim();
    }
    if (data.avatar !== undefined) {
      user.avatar = data.avatar;
    }
    const saved = await this.usersRepository.save(user);
    return {
      id: saved.id,
      name: saved.name,
      mobileNumber: saved.mobileNumber,
      avatar: saved.avatar,
    };
  }
}
