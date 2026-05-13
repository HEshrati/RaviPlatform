import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable()
export class AiGatewayService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.gapgpt.app/v1/chat/completions';
  private readonly model = 'gpt-4o-mini';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ANTHROPIC_API_KEY') || '';
  }

  async chat(messages: Message[]): Promise<{ reply: string }> {
    if (!this.apiKey) {
      throw new HttpException('کلید API تنظیم نشده است.', HttpStatus.SERVICE_UNAVAILABLE);
    }

    const systemPrompt = `تو دستیار هوشمند اپلیکیشن راوی هستی.
راوی یک پلتفرم برای برگزاری همنشینی‌ها و رویدادهای اجتماعی در ایران است.
همیشه به فارسی پاسخ بده. لحن گرم، صمیمی و مفید داشته باش. پاسخ‌هایت را کوتاه و مفید نگه دار (حداکثر ۳-۴ جمله).`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 1024,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`GapGPT API error: ${response.status}`, errorBody);
        throw new HttpException('خطا در اتصال به سرویس هوش مصنوعی.', HttpStatus.BAD_GATEWAY);
      }

      const data: any = await response.json();
      const reply = data?.choices?.[0]?.message?.content || 'متأسفانه پاسخی دریافت نشد.';
      return { reply };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('AI Gateway unexpected error:', error);
      return { reply: 'سرویس هوش مصنوعی موقتاً در دسترس نیست.' };
    }
  }
}
