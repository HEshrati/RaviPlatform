/**
 * سرویس بازی یخ‌شکن هوشمند — لایه ۴+۵
 * - انتخاب هوشمند کاربر برای هر سوال (بر اساس SmartProfile)
 * - تصویر خودکار مرتبط با موضوع سوال
 */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventQuiz, QuizQuestion } from './entities/event-quiz.entity';
import { SmartProfile } from '../smart-profile/entities/smart-profile.entity';
import { Profile }      from '../profiles/entities/profile.entity';
import { Booking }      from '../bookings/entities/booking.entity';
import { User }         from '../users/entities/user.entity';

const KEYWORDS: Record<string, string> = {
  سفر:'travel', خاطره:'nostalgia', رویا:'stars', غذا:'food',
  موسیقی:'music', کتاب:'reading', طبیعت:'nature', دوست:'friendship',
  خانواده:'family', آینده:'horizon', ترس:'courage', شاد:'happiness',
  زندگی:'wisdom', معنا:'philosophy', هنر:'art', ورزش:'sport',
};

function autoImage(question: string, seed = 0): string {
  const lq = question.toLowerCase();
  let kw = 'connection';
  for (const [k, v] of Object.entries(KEYWORDS)) if (lq.includes(k)) { kw = v; break; }
  return `https://source.unsplash.com/featured/800x400/?${kw}&sig=${seed}`;
}

@Injectable()
export class SmartIcebreakerService {
  private readonly logger = new Logger(SmartIcebreakerService.name);
  private readonly sessions = new Map<string, Map<number, string[]>>();

  constructor(
    @InjectRepository(EventQuiz)    private quizRepo:        Repository<EventQuiz>,
    @InjectRepository(SmartProfile) private smartProfileRepo: Repository<SmartProfile>,
    @InjectRepository(Profile)      private profileRepo:      Repository<Profile>,
    @InjectRepository(Booking)      private bookingRepo:      Repository<Booking>,
    @InjectRepository(User)         private userRepo:         Repository<User>,
  ) {}

  enrichQuestionWithImage(q: any): any {
    if (!q.image_url) q.image_url = autoImage(q.question, q.id || Math.random() * 1000);
    return q;
  }

  async getQuizWithImages(eventId: string): Promise<any | null> {
    const quiz = await this.quizRepo.findOne({ where: { event_id: eventId, is_active: true } });
    if (!quiz) return null;
    return {
      ...quiz,
      questions: quiz.questions.map((q, i) => ({
        id: q.id, question: q.question, options: q.options,
        image_url: q.image_url || autoImage(q.question, i * 17),
      })),
    };
  }

  async assignNextQuestion(eventId: string, quizId: string, questionIdx: number) {
    const quiz = await this.quizRepo.findOne({ where: { id: quizId, event_id: eventId } });
    if (!quiz) throw new NotFoundException('کوییز یافت نشد');
    const q = quiz.questions[questionIdx];
    if (!q) throw new NotFoundException('سوال یافت نشد');

    const bookings = await this.bookingRepo.find({ where: { event_id: eventId, status: 'confirmed' } });
    if (!bookings.length) throw new NotFoundException('شرکت‌کننده یافت نشد');
    const userIds = bookings.map(b => b.user_id);

    const [profiles, smarts, users] = await Promise.all([
      this.profileRepo.find({ where: userIds.map(id => ({ user_id: id })) }),
      this.smartProfileRepo.find({ where: userIds.map(id => ({ user_id: id })) }),
      this.userRepo.find({ where: userIds.map(id => ({ id })) }),
    ]);
    const pMap = new Map(profiles.map(p => [p.user_id, p]));
    const sMap = new Map(smarts.map(s => [s.user_id, s]));
    const uMap = new Map(users.map(u => [u.id, u]));

    const key = `${eventId}_${quizId}`;
    if (!this.sessions.has(key)) this.sessions.set(key, new Map());
    const session = this.sessions.get(key)!;
    const asked   = session.get(questionIdx) || [];

    const eligible   = userIds.filter(id => !asked.includes(id));
    const candidates = eligible.length ? eligible : userIds;

    const lq = q.question.toLowerCase();
    const scored = candidates.map(uid => {
      const sp = sMap.get(uid);
      let score = 50 + Math.random() * 10;
      let reason = 'انتخاب هوشمند';

      if ((lq.includes('سفر') || lq.includes('مکان')) && sp?.extroversion_score && sp.extroversion_score > 60)
        { score += 20; reason = 'روحیه ماجراجو'; }
      if ((lq.includes('خاطره') || lq.includes('کودکی')) && sp?.extroversion_score && sp.extroversion_score < 40)
        { score += 15; reason = 'درون‌گرا با خاطرات عمیق'; }
      if ((lq.includes('دوست') || lq.includes('مردم')) && sp?.communication_type === 'extrovert')
        { score += 25; reason = 'روحیه اجتماعی'; }
      if ((lq.includes('معنا') || lq.includes('زندگی')) && sp?.dominant_need === 'meaning')
        { score += 20; reason = 'تفکر فلسفی'; }
      if (sp?.interaction_rhythm === 'observer')
        { score += 10; reason = 'نوبت صحبت'; }
      if (sp?.telegram_behavior?.avg_messages_per_event && sp.telegram_behavior.avg_messages_per_event > 10)
        score -= 15;

      const u = uMap.get(uid);
      return { userId: uid, name: u?.name || `کاربر`, avatar: u?.avatar, reason, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    session.set(questionIdx, [...asked, best.userId]);

    return {
      questionId  : q.id,
      question    : q.question,
      imageUrl    : q.image_url || autoImage(q.question, questionIdx * 17),
      assignedUser: { userId: best.userId, name: best.name, avatar: best.avatar, reason: best.reason },
      previouslyAsked: asked,
    };
  }
}
