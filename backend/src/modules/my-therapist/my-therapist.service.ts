import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TherapistProfile } from './entities/therapist-profile.entity';
import { SupportGroup } from './entities/support-group.entity';
import { MtIntakeResponse } from './entities/intake-response.entity';
import {
  TherapySessionBooking,
  SupportGroupMembership,
} from './entities/session-booking.entity';
import { IntakeDto } from './dto/intake.dto';
import { BookSessionDto } from './dto/book-session.dto';

@Injectable()
export class MyTherapistService {
  private readonly logger = new Logger(MyTherapistService.name);

  constructor(
    @InjectRepository(TherapistProfile)
    private therapistRepo: Repository<TherapistProfile>,
    @InjectRepository(SupportGroup)
    private groupRepo: Repository<SupportGroup>,
    @InjectRepository(MtIntakeResponse)
    private intakeRepo: Repository<MtIntakeResponse>,
    @InjectRepository(TherapySessionBooking)
    private bookingRepo: Repository<TherapySessionBooking>,
    @InjectRepository(SupportGroupMembership)
    private membershipRepo: Repository<SupportGroupMembership>,
  ) {}

  async submitIntake(userId: string, dto: IntakeDto): Promise<MtIntakeResponse> {
    let intake = await this.intakeRepo.findOne({ where: { user_id: userId } });
    if (!intake) {
      intake = this.intakeRepo.create({ user_id: userId });
    }
    intake.concern_topics = dto.concernTopics;
    intake.custom_concern = dto.customConcern;
    intake.preferred_mode = dto.preferredMode;
    intake.preferred_times = dto.preferredTimes;
    intake.city = dto.city;
    intake.scale_answers = dto.scaleAnswers;
    intake.budget = dto.budget;
    intake.gender_preference = dto.genderPreference || 'any';
    intake.notes = dto.notes;
    return this.intakeRepo.save(intake);
  }

  async getMyIntake(userId: string): Promise<MtIntakeResponse | null> {
    return this.intakeRepo.findOne({ where: { user_id: userId } });
  }

  async getTherapists(userId: string): Promise<any[]> {
    const intake = await this.intakeRepo.findOne({ where: { user_id: userId } });
    const list = await this.therapistRepo.find({
      where: { is_active: true, verified: true },
      relations: ['user'],
    });
    return list.map((t) => this.shapeTherapist(t, intake));
  }

  async getTherapistById(id: string, userId: string): Promise<any> {
    const t = await this.therapistRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!t) throw new NotFoundException('روانشناس پیدا نشد');
    const intake = await this.intakeRepo.findOne({ where: { user_id: userId } });
    return this.shapeTherapist(t, intake);
  }

  async getGroups(userId: string): Promise<any[]> {
    const intake = await this.intakeRepo.findOne({ where: { user_id: userId } });
    const list = await this.groupRepo.find({
      where: { status: 'active' },
      relations: ['facilitator', 'facilitator.user'],
    });
    return list.map((g) => this.shapeGroup(g, intake));
  }

  async getGroupById(id: string, userId: string): Promise<any> {
    const g = await this.groupRepo.findOne({
      where: { id },
      relations: ['facilitator', 'facilitator.user'],
    });
    if (!g) throw new NotFoundException('گروه پیدا نشد');
    const intake = await this.intakeRepo.findOne({ where: { user_id: userId } });
    return this.shapeGroup(g, intake);
  }

  async bookSession(userId: string, dto: BookSessionDto): Promise<any> {
    const therapist = await this.therapistRepo.findOne({
      where: { id: dto.therapistId, is_active: true },
    });
    if (!therapist) throw new NotFoundException('روانشناس پیدا نشد');

    const booking = this.bookingRepo.create({
      user_id: userId,
      therapist_id: therapist.id,
      slot_date: dto.slotDate,
      slot_time: dto.slotTime,
      mode: dto.mode,
      status: 'pending',
      payment_status: 'pending',
      amount: therapist.price_per_session,
    });
    const saved = await this.bookingRepo.save(booking);

    return {
      id: saved.id,
      status: saved.status,
      amount: saved.amount,
      paymentUrl: null,
      message: 'رزرو اولیه ثبت شد. در حال انتقال به پرداخت...',
    };
  }

  async joinGroup(userId: string, groupId: string): Promise<any> {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('گروه پیدا نشد');
    if (group.status !== 'active')
      throw new BadRequestException('این گروه فعال نیست');

    const existing = await this.membershipRepo.findOne({
      where: { user_id: userId, group_id: groupId },
    });
    if (existing && ['active', 'pending'].includes(existing.status)) {
      throw new BadRequestException('شما قبلاً در این گروه عضو شده‌اید');
    }

    const isFull = group.members_count >= group.capacity;
    const membership = this.membershipRepo.create({
      user_id: userId,
      group_id: groupId,
      status: isFull ? 'on_waitlist' : 'pending',
      payment_status: 'pending',
      amount: group.price_per_month,
    });
    const saved = await this.membershipRepo.save(membership);

    return {
      id: saved.id,
      status: saved.status,
      amount: saved.amount,
      paymentUrl: null,
      message: isFull
        ? 'گروه پر است. شما به صف انتظار اضافه شدید.'
        : 'ثبت‌نام اولیه ثبت شد. در حال انتقال به پرداخت...',
    };
  }

  private calcTherapistScore(t: TherapistProfile, intake: MtIntakeResponse | null): number {
    if (!intake) return Math.round(t.rating * 18);
    const specialtyMap: Record<string, string[]> = {
      anxiety: ['اضطراب', 'استرس', 'وسواس'],
      depression: ['افسردگی', 'خلق', 'سوگ'],
      relationships: ['روابط', 'زوج', 'زناشویی', 'عاطفی'],
      self_growth: ['رشد فردی', 'خودشناسی', 'هویت'],
      trauma: ['تروما', 'آسیب', 'PTSD'],
      loneliness: ['تنهایی', 'انزوا', 'روابط'],
      family: ['خانواده', 'والدین'],
      career: ['شغل', 'کاری'],
      addiction: ['اعتیاد', 'وابستگی'],
    };
    let score = 0;
    const targetSpecs = (intake.concern_topics || []).flatMap((c) => specialtyMap[c] || []);
    const matches = (t.specialties || []).filter((s) =>
      targetSpecs.some((ts) => s.includes(ts)),
    ).length;
    score += Math.min(50, matches * 17);
    if ((t.modes || []).includes(intake.preferred_mode)) score += 25;
    if (intake.preferred_mode === 'in_person' && intake.city && t.city === intake.city) {
      score += 15;
    } else if (intake.preferred_mode === 'online') {
      score += 15;
    }
    score += Math.round((t.rating / 5) * 10);
    return Math.min(100, Math.max(40, score));
  }

  private calcGroupScore(g: SupportGroup, intake: MtIntakeResponse | null): number {
    if (!intake) return 70;
    const topicMap: Record<string, string[]> = {
      anxiety: ['اضطراب', 'استرس'],
      depression: ['افسردگی', 'خلق'],
      relationships: ['روابط', 'زوج', 'جدایی', 'طلاق'],
      self_growth: ['رشد', 'معنا', 'خودشناسی'],
      trauma: ['تروما', 'آسیب', 'بازماندگان'],
      loneliness: ['تنهایی', 'انزوا'],
      family: ['خانواده'],
      career: ['شغل'],
      addiction: ['اعتیاد'],
    };
    let score = 50;
    const targets = (intake.concern_topics || []).flatMap((c) => topicMap[c] || []);
    if (targets.some((t) => g.topic.includes(t) || g.name.includes(t))) {
      score += 35;
    }
    if (g.mode === intake.preferred_mode) score += 10;
    if (g.mode === 'in_person' && intake.city && g.city === intake.city) {
      score += 5;
    }
    return Math.min(100, Math.max(40, score));
  }

  private shapeTherapist(t: TherapistProfile, intake: MtIntakeResponse | null) {
    return {
      id: t.id,
      name: (t as any).user?.name || 'روانشناس',
      avatarUrl: t.avatar_url,
      credentials: t.credentials || [],
      specialties: t.specialties || [],
      bio: t.bio,
      yearsOfExperience: t.years_of_experience,
      pricePerSession: Number(t.price_per_session),
      modes: t.modes || ['online'],
      rating: t.rating,
      reviewsCount: t.reviews_count,
      city: t.city,
      verified: t.verified,
      matchScore: this.calcTherapistScore(t, intake),
      availableSlots: [],
    };
  }

  private shapeGroup(g: SupportGroup, intake: MtIntakeResponse | null) {
    const facilitatorName = (g as any).facilitator?.user?.name || 'تسهیل‌گر گروه';
    return {
      id: g.id,
      name: g.name,
      topic: g.topic,
      description: g.description,
      facilitatorName,
      facilitatorId: g.facilitator_id,
      schedule: g.schedule,
      mode: g.mode,
      city: g.city,
      capacity: g.capacity,
      membersCount: g.members_count,
      pricePerMonth: Number(g.price_per_month),
      confidentialityLevel: g.confidentiality_level,
      rules: g.rules || [],
      imageUrl: g.image_url,
      matchScore: this.calcGroupScore(g, intake),
    };
  }
}
