import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultationTopic } from './entities/consultation-topic.entity';
import { ConsultationFlowSession } from './entities/consultation-flow-session.entity';
import { TherapistProfile } from './entities/therapist-profile.entity';
import { StartConsultationDto, SelectTopicDto, SelectProviderDto, SubmitConcernsDto } from './dto/start-consultation.dto';

@Injectable()
export class ConsultationFlowService {
  constructor(
    @InjectRepository(ConsultationTopic)    private topicsRepo: Repository<ConsultationTopic>,
    @InjectRepository(ConsultationFlowSession) private sessionsRepo: Repository<ConsultationFlowSession>,
    @InjectRepository(TherapistProfile)    private therapistsRepo: Repository<TherapistProfile>,
  ) {}

  /** تمام تاپیک‌های فعال */
  async getTopics(serviceType?: string) {
    const qb = this.topicsRepo.createQueryBuilder('t').where('t.is_active = true');
    if (serviceType) qb.andWhere(':type = ANY(t.service_types)', { type: serviceType });
    return qb.orderBy('t.sort_order', 'ASC').getMany();
  }

  /** شروع session — یا بازگردانی session ناتموم */
  async startSession(userId: string, dto: StartConsultationDto) {
    const existing = await this.sessionsRepo.findOne({
      where: { user_id: userId, status: 'step_topic' as any },
      order: { created_at: 'DESC' },
    });
    if (existing) {
      existing.service_type = dto.serviceType;
      return { session: await this.sessionsRepo.save(existing), isNew: false };
    }
    const session = this.sessionsRepo.create({
      user_id: userId,
      service_type: dto.serviceType,
      status: 'step_topic',
    });
    return { session: await this.sessionsRepo.save(session), isNew: true };
  }

  /** مرحله ۱: انتخاب تاپیک */
  async selectTopic(userId: string, sessionId: string, dto: SelectTopicDto) {
    const session = await this.getOrFail(sessionId, userId);
    const topic = await this.topicsRepo.findOne({ where: { slug: dto.topicSlug } });
    if (!topic) throw new NotFoundException('تاپیک پیدا نشد');
    session.topic_slug = dto.topicSlug;
    session.status = 'step_provider';
    return this.sessionsRepo.save(session);
  }

  /** مرحله ۲: لیست providers بر اساس topic */
  async getProviders(sessionId: string, userId: string) {
    const session = await this.getOrFail(sessionId, userId);
    if (!session.topic_slug) throw new BadRequestException('اول تاپیک رو انتخاب کن');
    const topic = await this.topicsRepo.findOne({ where: { slug: session.topic_slug } });

    if (session.service_type === 'hamzist') {
      return { providers: [], topic, note: 'همزیست‌ها به زودی اضافه می‌شوند' };
    }

    const therapists = await this.therapistsRepo
      .createQueryBuilder('t')
      .where(':slug = ANY(t.specialties)', { slug: session.topic_slug })
      .orWhere(':name = ANY(t.specialties)', { name: topic?.name || '' })
      .limit(20)
      .getMany();

    return { providers: therapists, topic };
  }

  /** مرحله ۲: انتخاب provider */
  async selectProvider(userId: string, sessionId: string, dto: SelectProviderDto) {
    const session = await this.getOrFail(sessionId, userId);
    session.selected_provider_id = dto.providerId;
    session.status = 'step_tests';
    return this.sessionsRepo.save(session);
  }

  /** تست‌های لازم برای تاپیک */
  async getRequiredTests(sessionId: string, userId: string) {
    const session = await this.getOrFail(sessionId, userId);
    const topic = session.topic_slug
      ? await this.topicsRepo.findOne({ where: { slug: session.topic_slug } })
      : null;
    return {
      session,
      topic,
      requiredTests: topic?.required_tests || [],
      privacyNote: 'نتایج تست‌ها و متن نوشته‌شده فقط برای روانشناس شما قابل مشاهده است.',
    };
  }

  /** مرحله ۳: ارسال دغدغه‌ها و پاسخ تست‌ها */
  async submitConcerns(userId: string, sessionId: string, dto: SubmitConcernsDto) {
    const session = await this.getOrFail(sessionId, userId);
    if (dto.concernsText.length < 200)
      throw new BadRequestException('متن باید حداقل ۲۰۰ کاراکتر باشد');
    session.concerns_text    = dto.concernsText;
    session.concerns_char_count = dto.concernsText.length;
    session.test_answers     = dto.testAnswers || {};
    session.status           = 'completed';
    session.completed_at     = new Date();
    const saved = await this.sessionsRepo.save(session);

    // اعلان به ادمین از طریق لاگ (بعداً notification service وصل میشه)
    const logger = new Logger('ConsultationFlow');
    logger.log(`New consultation request: user=${userId} topic=${session.topic_slug} provider=${session.selected_provider_id}`);

    return saved;
  }

  async getSession(sessionId: string, userId: string) {
    return this.getOrFail(sessionId, userId);
  }

  async getMySessions(userId: string) {
    return this.sessionsRepo.find({ where: { user_id: userId }, order: { created_at: 'DESC' } });
  }

  async getAdminRequests(requestingUserId: string) {
    // همه session های completed
    return this.sessionsRepo.find({
      where: { status: 'completed' as any },
      order: { completed_at: 'DESC' },
      take: 100,
    });
  }

  private async getOrFail(id: string, userId: string) {
    const s = await this.sessionsRepo.findOne({ where: { id, user_id: userId } });
    if (!s) throw new NotFoundException('session پیدا نشد');
    return s;
  }
}
