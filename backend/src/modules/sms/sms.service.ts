/**
 * سرویس مرکزی SMS — استفاده از SMS.ir
 * API Key از متغیر محیطی OTP_API_KEY
 */
import { Injectable, Logger } from '@nestjs/common';

export interface SmsParam { name: string; value: string; }
export interface SmsSendResult { success: boolean; messageId?: string; error?: string; }

export enum SmsTemplate {
  OTP                = 'OTP_TEMPLATE_ID',
  BOOKING_CONFIRM    = 'BOOKING_CONFIRM_TEMPLATE_ID',
  LOCATION_REVEAL    = 'LOCATION_REVEAL_TEMPLATE_ID',
  MERGE              = 'MERGE_SMS_TEMPLATE_ID',
  BOOKING_REMINDER   = 'BOOKING_REMINDER_TEMPLATE_ID',
  LOCATION_CHANGE    = 'LOCATION_CHANGE_TEMPLATE_ID',
  TELEGRAM_INVITE    = 'TELEGRAM_INVITE_TEMPLATE_ID',
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey  = process.env.OTP_API_KEY || '';
  private readonly isProd  = process.env.NODE_ENV === 'production';
  private readonly baseUrl = 'https://api.sms.ir/v1';

  constructor() {
    if (!this.apiKey && this.isProd)
      this.logger.error('⛔ OTP_API_KEY تنظیم نشده!');
  }

  async send(mobile: string, templateEnvKey: SmsTemplate | string, params: SmsParam[]): Promise<SmsSendResult> {
    const templateId = parseInt(process.env[templateEnvKey] || '100000');
    return this.sendWithTemplateId(mobile, templateId, params);
  }

  async sendWithTemplateId(mobile: string, templateId: number, params: SmsParam[]): Promise<SmsSendResult> {
    const m = this.normalizeMobile(mobile);
    if (!m) return { success: false, error: 'شماره نامعتبر' };

    if (!this.isProd || !this.apiKey) {
      this.logger.log(`[DEV SMS] → ${m} | tpl:${templateId} | ${params.map(p=>`${p.name}=${p.value}`).join(', ')}`);
      return { success: true, messageId: `dev-${Date.now()}` };
    }

    try {
      const res  = await fetch(`${this.baseUrl}/send/verify`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': this.apiKey },
        body   : JSON.stringify({ mobile: m, templateId, parameters: params }),
      });
      const data = await res.json() as any;
      if (res.ok && data.status === 1) {
        this.logger.log(`✅ SMS → ${m}`);
        return { success: true, messageId: String(data.data?.messageId || '') };
      }
      this.logger.error(`❌ SMS → ${m}: ${data.message}`);
      return { success: false, error: data.message };
    } catch (e: any) {
      this.logger.error(`❌ Network SMS → ${m}:`, e.message);
      return { success: false, error: e.message };
    }
  }

  sendOtp(mobile: string, code: string) {
    return this.send(mobile, SmsTemplate.OTP, [{ name:'Code', value:code }]);
  }
  sendBookingConfirm(mobile: string, name: string, eventTitle: string) {
    return this.send(mobile, SmsTemplate.BOOKING_CONFIRM, [
      { name:'Name', value:name }, { name:'EventTitle', value:eventTitle },
    ]);
  }
  sendLocationReveal(mobile: string, eventTitle: string, location: string, eventDate: string, siteUrl: string) {
    return this.send(mobile, SmsTemplate.LOCATION_REVEAL, [
      { name:'EventTitle', value:eventTitle }, { name:'Location', value:location },
      { name:'EventDate',  value:eventDate  }, { name:'SiteUrl',  value:siteUrl  },
    ]);
  }
  sendBookingReminder(mobile: string, name: string, link: string) {
    return this.send(mobile, SmsTemplate.BOOKING_REMINDER, [
      { name:'Name', value:name }, { name:'Link', value:link },
    ]);
  }
  sendMergeNotification(mobile: string, eventTitle: string, eventDate: string, eventTime: string, siteUrl: string) {
    return this.send(mobile, SmsTemplate.MERGE, [
      { name:'EventTitle', value:eventTitle }, { name:'EventDate', value:eventDate },
      { name:'EventTime',  value:eventTime  }, { name:'SiteUrl',  value:siteUrl  },
    ]);
  }
  sendTelegramInvite(mobile: string, eventTitle: string, telegramLink: string) {
    return this.send(mobile, SmsTemplate.TELEGRAM_INVITE, [
      { name:'EventTitle', value:eventTitle }, { name:'TelegramLink', value:telegramLink },
    ]);
  }

  async getCredit(): Promise<number> {
    if (!this.apiKey) return 0;
    try {
      const r = await fetch(`${this.baseUrl}/credit`, { headers:{ 'x-api-key': this.apiKey } });
      return (await r.json() as any).data?.credit || 0;
    } catch { return 0; }
  }

  async sendBulk(recipients: Array<{ mobile:string; params:SmsParam[] }>, templateId: number, delayMs=100) {
    const stats = { sent:0, failed:0 };
    for (const r of recipients) {
      const res = await this.sendWithTemplateId(r.mobile, templateId, r.params);
      res.success ? stats.sent++ : stats.failed++;
      if (delayMs > 0) await new Promise(x => setTimeout(x, delayMs));
    }
    this.logger.log(`��� Bulk: ${stats.sent} sent, ${stats.failed} failed`);
    return stats;
  }

  private normalizeMobile(mobile: string): string | null {
    if (!mobile) return null;
    let m = mobile.replace(/\D/g, '');
    if (m.startsWith('0098')) m = m.slice(2);
    if (m.startsWith('98') && m.length === 12) m = m.slice(2);
    if (m.startsWith('0')  && m.length === 11) m = m.slice(1);
    return m.length === 10 && m.startsWith('9') ? m : null;
  }
}
