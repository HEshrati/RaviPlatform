import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  async create(userId: string, type: string, title: string, message: string) {
    const n = this.repo.create({ userId, type, title, message });
    return this.repo.save(n);
  }

  async findByUser(userId: string) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markRead(id: string, userId: string) {
    return this.repo.update({ id, userId }, { read: true });
  }

  async markAllRead(userId: string) {
    return this.repo.update({ userId }, { read: true });
  }

  async getUnreadCount(userId: string) {
    return this.repo.count({ where: { userId, read: false } });
  }
}