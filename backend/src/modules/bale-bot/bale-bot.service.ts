import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BaleBotService {
  private readonly logger = new Logger(BaleBotService.name);
  private readonly token = process.env.BALE_BOT_TOKEN || '';
  private readonly apiUrl = process.env.BALE_BOT_API_URL || 'https://tapi.bale.ai';
  private readonly enabled = process.env.BALE_BOT_ENABLED === 'true';

  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  private get apiBase(): string { return `${this.apiUrl}/bot${this.token}`; }

  private normalizePhone(phone: string): string {
    let p = String(phone).replace(/\D/g, '');
    if (p.startsWith('98')) return p;
    if (p.startsWith('0')) return '98' + p.substring(1);
    if (p.startsWith('9') && p.length === 10) return '98' + p;
    return p;
  }

  async sendOtp(phone: string, code: string): Promise<{ sent: boolean; reason?: string }> {
    if (!this.enabled || !this.token) return { sent: false, reason: 'disabled' };
    const normPhone = this.normalizePhone(phone);
    const rows = await this.ds.query(
      `SELECT chat_id FROM bale_user_chats WHERE phone = $1 LIMIT 1`,
      [normPhone],
    );
    if (!rows?.length) return { sent: false, reason: 'not_connected' };

    const chatId = rows[0].chat_id;
    const text =
      `🔐 *کد ورود راوی*\n\n` +
      `کد یکبار مصرف شما: \`${code}\`\n\n` +
      `⏱ این کد به مدت ۵ دقیقه معتبر است.\n` +
      `🚫 این کد را با هیچکس به اشتراک نگذارید.`;
    try {
      const res = await fetch(`${this.apiBase}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
      });
      const data: any = await res.json();
      if (data.ok) {
        this.logger.log(`OTP sent — chat=${chatId} phone=${normPhone}`);
        return { sent: true };
      }
      this.logger.warn(`Bale send failed: ${data.description}`);
      return { sent: false, reason: data.description || 'api_error' };
    } catch (e: any) {
      this.logger.error(`Bale exception: ${e.message}`);
      return { sent: false, reason: 'exception' };
    }
  }

  async handleUpdate(update: any) {
    const msg = update?.message;
    if (!msg) return;
    const chatId = msg.chat.id;
    const text = msg.text || '';

    if (text.startsWith('/start')) {
      await this.sendMessage(chatId,
        '🌟 *به ربات راوی خوش آمدید*\n\n' +
        'برای دریافت کدهای ورود از طریق بله، لطفاً شماره موبایلتان را به اشتراک بگذارید:',
        {
          keyboard: [[{ text: '📱 ارسال شماره من', request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        });
      return;
    }

    if (msg.contact?.phone_number) {
      const phone = this.normalizePhone(msg.contact.phone_number);
      await this.ds.query(
        `INSERT INTO bale_user_chats (phone, chat_id, first_name, last_name, username, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (phone) DO UPDATE SET 
           chat_id = EXCLUDED.chat_id,
           first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name,
           username = EXCLUDED.username,
           updated_at = NOW()`,
        [phone, chatId, msg.from?.first_name || null, msg.from?.last_name || null, msg.from?.username || null],
      );
      await this.sendMessage(chatId,
        '✅ شماره شما با موفقیت ثبت شد!\n\n' +
        'از این به بعد، کدهای ورود راوی از طریق همین ربات به شما ارسال می‌شود.\n\n' +
        'برای قطع اتصال: /disconnect',
        { remove_keyboard: true });
      return;
    }

    if (text === '/disconnect') {
      await this.ds.query(`DELETE FROM bale_user_chats WHERE chat_id = $1`, [chatId]);
      await this.sendMessage(chatId, '🔓 ارتباط قطع شد. هر زمان با /start می‌توانید مجدد وصل شوید.');
      return;
    }

    await this.sendMessage(chatId, 'برای شروع /start را بزنید.');
  }

  private async sendMessage(chatId: number, text: string, replyMarkup?: any) {
    if (!this.token) return;
    try {
      await fetch(`${this.apiBase}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown', reply_markup: replyMarkup }),
      });
    } catch (e: any) {
      this.logger.error(`sendMessage: ${e.message}`);
    }
  }

  async setWebhook(url: string) {
    const res = await fetch(`${this.apiBase}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    return res.json();
  }
  async getWebhookInfo() {
    return (await fetch(`${this.apiBase}/getWebhookInfo`)).json();
  }
  async deleteWebhook() {
    return (await fetch(`${this.apiBase}/deleteWebhook`, { method: 'POST' })).json();
  }
}
