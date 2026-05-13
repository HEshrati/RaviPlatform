import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiContent, ContentStatus } from './entities/ai-content.entity';

const AI_API_URL = (process.env.ANTHROPIC_BASE_URL || 'https://api.gapgpt.app/v1') + '/messages';
const AI_API_KEY = process.env.ANTHROPIC_API_KEY || '';

const CONTENT_TOPICS = [
  'ارتباط موثر', 'سبک‌های دلبستگی', 'هوش هیجانی',
  'مرزهای سالم در رابطه', 'گوش دادن فعال', 'زبان عشق',
  'مقابله با تنهایی', 'اضطراب اجتماعی', 'رشد پس از تروما',
  'ذهن‌آگاهی در روابط', 'درون‌گرایی و برون‌گرایی', 'نیازهای عاطفی در بزرگسالی',
];

@Injectable()
export class AiContentService {
  private readonly logger = new Logger(AiContentService.name);

  constructor(
    @InjectRepository(AiContent)
    private readonly contentRepo: Repository<AiContent>,
  ) {}

  async generatePsychologicalArticle(topicOverride?: string): Promise<AiContent> {
    const topic = topicOverride || this.getRandomTopic();
    this.logger.log(`Generating article on topic: ${topic}`);
    try {
      const content = await this.callAIAPI(topic);
      const article = this.contentRepo.create({
        title:            content.title,
        content:          content.body,
        summary:          content.summary,
        tags:             content.tags,
        status:           ContentStatus.DRAFT,
        source_reference: `AI-generated: ${topic}`,
      }) as unknown as AiContent;
      const saved = await this.contentRepo.save(article) as unknown as AiContent;
      this.logger.log(`Draft article created: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to generate article: ${error.message}`);
      throw error;
    }
  }

  private async callAIAPI(topic: string): Promise<{ title: string; body: string; summary: string; tags: string[] }> {
    if (!AI_API_KEY) {
      this.logger.warn('ANTHROPIC_API_KEY not set — returning placeholder content');
      return { title: `${topic}: راهنمای عملی`, summary: `نگاهی به ${topic}`, body: `محتوا برای: ${topic}`, tags: [topic] };
    }
    if (!AI_API_KEY) {
      this.logger.warn('ANTHROPIC_API_KEY not set — returning placeholder');
      return { title: `${topic}: راهنمای عملی`, summary: `نگاهی به ${topic}`, body: `محتوا برای: ${topic}`, tags: [topic] };
    }
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': AI_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929', max_tokens: 1500, messages: [{ role: 'user', content: `مقاله روانشناسانه درباره: ${topic}. فرمت JSON: {title, summary, body, tags}` }] }),
    });
    const data = await response.json() as any;
    const text = data.content?.[0]?.text || '';
    try { return JSON.parse(text.trim()); }
    catch { return { title: `${topic}: راهنمای عملی`, summary: `نگاهی به ${topic}`, body: text, tags: [topic] }; }
  }

  async approveAndPublish(contentId: string, adminUserId: string): Promise<AiContent> {
    const content = await this.contentRepo.findOne({ where: { id: contentId } });
    content.status = ContentStatus.PUBLISHED;
    content.published_at = new Date();
    content.reviewed_by = adminUserId;
    content.reviewed_at = new Date();
    return this.contentRepo.save(content);
  }

  async rejectContent(contentId: string, reason?: string): Promise<AiContent> {
    const content = await this.contentRepo.findOne({ where: { id: contentId } });
    content.status = ContentStatus.REJECTED;
    content.admin_note = reason || '';
    content.reviewed_at = new Date();
    return this.contentRepo.save(content);
  }

  async editContent(contentId: string, updates: { title?: string; body?: string; summary?: string }): Promise<AiContent> {
    const content = await this.contentRepo.findOne({ where: { id: contentId } });
    if (updates.title)   content.title   = updates.title;
    if (updates.body)    content.content = updates.body;
    if (updates.summary) content.summary = updates.summary;
    return this.contentRepo.save(content);
  }

  async getPublishedArticles(page = 1, limit = 10): Promise<{ data: AiContent[]; total: number; page: number }> {
    const [data, total] = await this.contentRepo.findAndCount({
      where: { status: ContentStatus.PUBLISHED },
      order: { published_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page };
  }

  async getDrafts(): Promise<AiContent[]> {
    return this.contentRepo.find({ where: { status: ContentStatus.DRAFT }, order: { created_at: 'DESC' } });
  }

  async scheduleWeeklyContent(): Promise<void> {
    await this.generatePsychologicalArticle();
    setTimeout(() => this.generatePsychologicalArticle(), 5000);
  }

  async answerSupportQuestion(question: string): Promise<{ answer: string; isHandledByAI: boolean; telegramSupportLink?: string }> {
    const FAQ_TOPICS = ['قوانین','ثبت‌نام','رزرو','پرداخت','لغو','گروه','تلگرام','پروفایل','امتیاز','رویداد'];
    try {
      const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': AI_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929', max_tokens: 300, messages: [{ role: 'user', content: question }] }),
      });
      const data = await response.json() as any;
      const answer = data.content?.[0]?.text || '';
      if (answer.includes('نیاز به بررسی'))
        return { answer, isHandledByAI: false, telegramSupportLink: 'https://t.me/RaaviSupport' };
      return { answer, isHandledByAI: true };
    } catch {
      return { answer: 'متاسفم، خطا رخ داد.', isHandledByAI: false, telegramSupportLink: 'https://t.me/RaaviSupport' };
    }
  }

  private getRandomTopic(): string {
    return CONTENT_TOPICS[Math.floor(Math.random() * CONTENT_TOPICS.length)];
  }
}
