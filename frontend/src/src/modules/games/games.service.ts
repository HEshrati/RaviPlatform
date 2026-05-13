import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventQuiz, QuizQuestion } from './entities/event-quiz.entity';
import { QuizResult } from './entities/quiz-result.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(EventQuiz)
    private quizRepo: Repository<EventQuiz>,
    @InjectRepository(QuizResult)
    private resultRepo: Repository<QuizResult>,
  ) {}

  async createQuiz(eventId: string, title: string, questions: QuizQuestion[]): Promise<EventQuiz> {
    const quiz = this.quizRepo.create({ event_id: eventId, title, questions });
    return this.quizRepo.save(quiz);
  }

  async updateQuiz(quizId: string, data: Partial<EventQuiz>): Promise<EventQuiz> {
    const quiz = await this.quizRepo.findOne({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('کوییز پیدا نشد');
    Object.assign(quiz, data);
    return this.quizRepo.save(quiz);
  }

  async getQuizByEvent(eventId: string): Promise<any | null> {
    const quiz = await this.quizRepo.findOne({ where: { event_id: eventId, is_active: true } });
    if (!quiz) return null;
    // سوال‌ها بدون پاسخ درست
    return {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        // correct_answer حذف می‌شه
      })),
    };
  }

  async submitQuiz(quizId: string, userId: string, answers: number[]): Promise<{
    score: number;
    total: number;
    correct_answers: number[];
    explanations: string[];
  }> {
    const quiz = await this.quizRepo.findOne({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('کوییز پیدا نشد');

    let score = 0;
    const correct_answers: number[] = [];
    const explanations: string[] = [];

    quiz.questions.forEach((q, idx) => {
      correct_answers.push(q.correct_answer);
      explanations.push(q.explanation || '');
      if (answers[idx] === q.correct_answer) score++;
    });

    // ذخیره نتیجه (یک بار)
    const existing = await this.resultRepo.findOne({ where: { quiz_id: quizId, user_id: userId } });
    if (!existing) {
      await this.resultRepo.save(this.resultRepo.create({
        quiz_id: quizId, user_id: userId, event_id: quiz.event_id,
        score, total_questions: quiz.questions.length, answers,
      }));
    }

    return { score, total: quiz.questions.length, correct_answers, explanations };
  }

  async getLeaderboard(quizId: string): Promise<QuizResult[]> {
    return this.resultRepo.find({
      where: { quiz_id: quizId },
      order: { score: 'DESC', completed_at: 'ASC' },
      take: 10,
    });
  }
}
