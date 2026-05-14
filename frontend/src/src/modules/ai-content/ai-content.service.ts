/**
 * سرویس تولید محتوای هوشمند
 * لایه ۵ - هوش مصنوعی پیشرفته
 * تولید مقالات روانشناسانه → درافت → تایید ادمین → انتشار
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { AiContent, ContentStatus } from './ai-content.entity';

const AI_API_URL = 'https://api.anthropic.com/v1/messages';
const AI_API_KEY = process.env.ANTHROPIC_API_KEY || 'sk-fRQfQLXc8pkuNIIf6eSokMD2KU1BdsLUXXj4gtv4yQLrIlxQ';

const CONTENT_TOPICS = [
  'ارتباط موثر',
  'سبک‌های دلبستگی',
  'هوش هیجانی',
  'مرزهای سالم در رابطه',
  'گوش دادن فعال',
  'زبان عشق',
  'مقابله با تنهایی',
  'اضطراب اجتماعی',
  'رشد پس از تروما',
  'ذهن‌آگاهی در روابط',
  'درون‌گرایی و برون‌گرایی',
  'نیازهای عاطفی در بزرگسالی',
];

@Injectable()
export class AiContentService {
  private readonly logger = new Logger(AiContentService.name);

  constructor(
    @InjectRepository(AiContent)
    private readonly contentRepo: Repository<AiContent>,
  ) {}

  /**
   * تولید مقاله روانشناسانه جدید
   * مرحله ۱: تولید → درافت (نیاز به تایید ادمین)
   */
  async generatePsychologicalArticle(
    topicOverride?: string,
  ): Promise<AiContent> {
    const topic = topicOverride || this.getRandomTopic();
    this.logger.log(`Generating article on topic: ${topic}`);

    try {
      const content = await this.callAIAPI(topic);
      
      const article = this.contentRepo.create({
        title: content.title,
        body: content.body,
        summary: content.summary,
        topic,
        tags: content.tags,
        status: ContentStatus.DRAFT, // نیاز به تایید ادمین
        ai_generated: true,
        reading_time_minutes: Math.ceil(content.body.split(' ').length / 200),
      });

      const saved = await this.contentRepo.save(article);
      this.logger.log(`Draft article created: ${saved.id} - "${saved.title}"`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to generate article: ${error.message}`);
      throw error;
    }
  }

  /**
   * فراخوانی API هوش مصنوعی
   */
  private async callAIAPI(topic: string): Promise<{
    title: string;
    body: string;
    summary: string;
    tags: string[];
  }> {
    const prompt = `
شما یک روانشناس و نویسنده متخصص هستید. یک مقاله کوتاه و کاربردی در مورد موضوع زیر بنویسید:

موضوع: ${topic}

مقاله باید:
- به زبان فارسی و ساده باشد
- بین ۳۰۰ تا ۵۰۰ کلمه باشد
- مبتنی بر روانشناسی علمی و مدرن باشد
- کاربردی و قابل استفاده در زندگی روزمره باشد
- مناسب برای پلتفرم دورهمی و ارتباط اجتماعی باشد

پاسخ را دقیقاً به این فرمت JSON بده (بدون markdown):
{
  "title": "عنوان جذاب مقاله",
  "summary": "خلاصه ۲ جمله‌ای",
  "body": "متن کامل مقاله با پاراگراف‌بندی مناسب",
  "tags": ["تگ۱", "تگ۲", "تگ۳"]
}
`;

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AI_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`AI API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    try {
      return JSON.parse(text.trim());
    } catch {
      // fallback اگر JSON parse خطا داد
      return {
        title: `${topic}: راهنمای عملی`,
        summary: `یک نگاه علمی و کاربردی به موضوع ${topic}`,
        body: text,
        tags: [topic, 'روانشناسی', 'سلامت روان'],
      };
    }
  }

  /**
   * تایید مقاله توسط ادمین و انتشار
   */
  async approveAndPublish(contentId: string, adminUserId: string): Promise<AiContent> {
    const content = await this.contentRepo.findOne({ where: { id: contentId } });
    if (!content) throw new NotFoundException('محتوا یافت نشد');

    content.status = ContentStatus.PUBLISHED;
    content.published_at = new Date();
    content.approved_by = adminUserId;

    return this.contentRepo.save(content);
  }

  /**
   * رد مقاله
   */
  async rejectContent(contentId: string, reason?: string): Promise<AiContent> {
    const content = await this.contentRepo.findOne({ where: { id: contentId } });
    if (!content) throw new NotFoundException('محتوا یافت نشد');

    content.status = ContentStatus.REJECTED;
    content.rejection_reason = reason || '';

    return this.contentRepo.save(content);
  }

  /**
   * ویرایش مقاله توسط ادمین قبل از انتشار
   */
  async editContent(
    contentId: string,
    updates: { title?: string; body?: string; summary?: string },
  ): Promise<AiContent> {
    const content = await this.contentRepo.findOne({ where: { id: contentId } });
    if (!content) throw new NotFoundException('محتوا یافت نشد');

    if (updates.title) content.title = updates.title;
    if (updates.body) content.body = updates.body;
    if (updates.summary) content.summary = updates.summary;

    return this.contentRepo.save(content);
  }

  /**
   * دریافت مقالات منتشرشده (برای سایت)
   */
  async getPublishedArticles(page = 1, limit = 10): Promise<{
    data: AiContent[];
    total: number;
    page: number;
  }> {
    const [data, total] = await this.contentRepo.findAndCount({
      where: { status: ContentStatus.PUBLISHED },
      order: { published_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page };
  }

  /**
   * دریافت درافت‌ها برای بررسی ادمین
   */
  async getDrafts(): Promise<AiContent[]> {
    return this.contentRepo.find({
      where: { status: ContentStatus.DRAFT },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * زمان‌بندی خودکار: ۲ بار در هفته
   * این متد توسط cron job یا n8n فراخوانی می‌شود
   */
  async scheduleWeeklyContent(): Promise<void> {
    this.logger.log('Generating weekly psychological content...');
    
    // دو مقاله در هفته
    await this.generatePsychologicalArticle();
    setTimeout(async () => {
      await this.generatePsychologicalArticle();
    }, 5000);
  }

  /**
   * پاسخ هوشمند به سوالات پشتیبانی
   */
  async answerSupportQuestion(question: string): Promise<{
    answer: string;
    isHandledByAI: boolean;
    telegramSupportLink?: string;
  }> {
    const FAQ_TOPICS = [
      'قوانین', 'ثبت‌نام', 'رزرو', 'پرداخت', 'لغو', 'گروه', 
      'تلگرام', 'پروفایل', 'امتیاز', 'رویداد',
    ];

    const isCommonQuestion = FAQ_TOPICS.some(topic => question.includes(topic));

    if (!isCommonQuestion) {
      return {
        answer: '',
        isHandledByAI: false,
        telegramSupportLink: 'https://t.me/RaaviSupport',
      };
    }

    const systemPrompt = `
شما دستیار پشتیبانی راوی هستید. راوی یک پلتفرم دورهمی اجتماعی است.
فقط به سوالات مرتبط با موضوعات زیر پاسخ دهید:
- قوانین راوی
- نحوه ثبت‌نام و رزرو رویداد
- پرداخت و لغو
- گروه‌های تلگرام
- پروفایل کاربری

اگر سوال خارج از این موضوعات بود، بگویید "این سوال نیاز به بررسی تیم پشتیبانی دارد".
پاسخ کوتاه و مفید به فارسی بده.
`;

    try {
      const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-6',
          max_tokens: 300,
          system: systemPrompt,
          messages: [{ role: 'user', content: question }],
        }),
      });

      const data = await response.json();
      const answer = data.content?.[0]?.text || '';

      if (answer.includes('نیاز به بررسی')) {
        return {
          answer,
          isHandledByAI: false,
          telegramSupportLink: 'https://t.me/RaaviSupport',
        };
      }

      return { answer, isHandledByAI: true };
    } catch {
      return {
        answer: 'متاسفم، در حال حاضر امکان پاسخگویی وجود ندارد.',
        isHandledByAI: false,
        telegramSupportLink: 'https://t.me/RaaviSupport',
      };
    }
  }

  private getRandomTopic(): string {
    return CONTENT_TOPICS[Math.floor(Math.random() * CONTENT_TOPICS.length)];
  }
}
