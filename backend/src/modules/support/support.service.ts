import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketStatus, TicketCategory } from './entities/support-ticket.entity';

const AI_API_KEY = process.env.AI_API_KEY || 'sk-fRQfQLXc8pkuNIIf6eSokMD2KU1BdsLUXXj4gtv4yQLrIlxQ';
const AI_API_URL = process.env.AI_API_URL || 'https://api.avalai.ir/v1';
const TELEGRAM_SUPPORT_URL = process.env.TELEGRAM_SUPPORT_URL || 'https://t.me/ravi_support';

const RAVI_FAQ_SYSTEM_PROMPT = `
تو دستیار پشتیبانی راوی هستی، یک پلتفرم هوشمند برای برگزاری دورهمی‌های اجتماعی در ایران.

اطلاعات کلی راوی:
- راوی یک پلتفرم است که با الگوریتم هوشمند افراد هم‌ذوق را در دورهمی‌های کوچک ۴-۶ نفره دور هم جمع می‌کند
- ثبت‌نام رایگان است اما شرکت در رویدادها نیاز به پرداخت هزینه دارد
- آدرس دقیق ۱۰ ساعت قبل از رویداد نمایش داده می‌شود
- در صورت عدم حضور دو بار، حساب کاربری موقتاً ساسپند می‌شود
- برای بازگشت بعد از ساسپند باید با تیم راوی تماس بگیرید

سوالات متداول که می‌توانی پاسخ دهی:
- نحوه ثبت‌نام و شرکت در رویدادها
- نحوه رزرو و پرداخت
- قوانین راوی
- درباره الگوریتم مچینگ
- نحوه لغو رزرو
- سوالات درباره گروه‌های تلگرامی

قوانین پاسخ:
1. فقط به سوالات مرتبط با راوی پاسخ بده
2. پاسخ‌ها کوتاه، مفید و دوستانه باشد
3. اگر سوال خارج از حوزه راوی است یا نیاز به بررسی شخصی دارد، کاربر را به تلگرام پشتیبانی هدایت کن
4. از کلمات مودبانه فارسی استفاده کن
`;

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(
    @InjectRepository(SupportTicket)
    private ticketRepo: Repository<SupportTicket>,
  ) {}

  async createTicket(
    userId: string | null,
    data: {
      subject: string;
      message: string;
      category?: TicketCategory;
      contactPhone?: string;
      contactName?: string;
    },
  ): Promise<SupportTicket> {
    const ticket = this.ticketRepo.create({
      user_id: userId || undefined,
      subject: data.subject,
      message: data.message,
      category: data.category,
      contact_phone: data.contactPhone,
      contact_name: data.contactName,
      status: TicketStatus.OPEN,
    });

    const saved = await this.ticketRepo.save(ticket);

    // تلاش برای پاسخ خودکار AI
    await this.tryAutoRespond(saved);

    return saved;
  }

  private async tryAutoRespond(ticket: SupportTicket): Promise<void> {
    try {
      const response = await fetch(`${AI_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: RAVI_FAQ_SYSTEM_PROMPT },
            {
              role: 'user',
              content: `موضوع: ${ticket.subject}\n\nسوال: ${ticket.message}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) return;

      const data = await response.json() as any;
      const aiResponse = data.choices?.[0]?.message?.content || '';

      if (aiResponse) {
        // بررسی اینکه آیا AI نیاز به ارجاع به انسان دارد
        const needsHuman =
          aiResponse.includes(TELEGRAM_SUPPORT_URL) ||
          aiResponse.toLowerCase().includes('پشتیبانی') ||
          aiResponse.toLowerCase().includes('تماس');

        await this.ticketRepo.update(ticket.id, {
          ai_response: needsHuman
            ? `${aiResponse}\n\n🔗 برای پشتیبانی بیشتر: ${TELEGRAM_SUPPORT_URL}`
            : aiResponse,
          ai_resolved: !needsHuman,
          status: needsHuman ? TicketStatus.PENDING_HUMAN : TicketStatus.AI_ANSWERED,
        });
      }
    } catch (err) {
      this.logger.error('خطا در پاسخ خودکار AI', err);
    }
  }

  // ── چت هوشمند سایت (Chat Assistant) ────────────────────────
  async chatWithAI(message: string, history: { role: string; content: string }[]): Promise<string> {
    const messages = [
      { role: 'system', content: RAVI_FAQ_SYSTEM_PROMPT },
      ...history.slice(-6), // آخرین ۶ پیام برای context
      { role: 'user', content: message },
    ];

    const response = await fetch(`${AI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 600,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      throw new Error('خطا در ارتباط با AI');
    }

    const data = await response.json() as any;
    const reply = data.choices?.[0]?.message?.content || 'متأسفم، نمی‌توانم در حال حاضر پاسخ دهم.';

    // اگر AI نمی‌تواند پاسخ دهد، لینک تلگرام را اضافه کن
    if (reply.includes('نمی‌توانم') || reply.includes('نمی‌دانم') || reply.includes('خارج از')) {
      return `${reply}\n\n📱 برای پشتیبانی مستقیم: [تیم راوی](${TELEGRAM_SUPPORT_URL})`;
    }

    return reply;
  }

  async findUserTickets(userId: string): Promise<SupportTicket[]> {
    return await this.ticketRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findAllTickets(status?: TicketStatus): Promise<SupportTicket[]> {
    const where: any = {};
    if (status) where.status = status;
    return await this.ticketRepo.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  async closeTicket(id: string, adminResponse: string): Promise<SupportTicket> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('تیکت یافت نشد');
    ticket.status = TicketStatus.CLOSED;
    ticket.admin_response = adminResponse;
    ticket.resolved_at = new Date();
    return await this.ticketRepo.save(ticket);
  }
}
