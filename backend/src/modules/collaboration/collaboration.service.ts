import { Injectable, Logger } from '@nestjs/common';

export interface NezamVerifyResult {
  valid: boolean;
  name?: string;
  membershipId?: string;
  degree?: string;
  field?: string;
}

@Injectable()
export class CollaborationService {
  private readonly logger = new Logger(CollaborationService.name);
  private readonly PCOIRAN_URL = 'https://my.pcoiran.ir/member/';

  async verifyNezamCode(code: string): Promise<NezamVerifyResult> {
    try {
      const url = `${this.PCOIRAN_URL}?mem_id=${encodeURIComponent(code)}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fa-IR,fa;q=0.9,en;q=0.5',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        this.logger.warn(`PCOIRAN responded with status ${response.status}`);
        return { valid: false };
      }

      const html = await response.text();

      const nameMatch = html.match(
        /<h5\s+class="card-title">\s*(.+?)\s*<\/h5>/,
      );
      if (!nameMatch) {
        return { valid: false };
      }

      const idMatch = html.match(
        /<p\s+class="card-text mb-0">\s*#(\d+)\s*<\/p>/,
      );
      const degreeMatch = html.match(
        /<p\s+class="card-text">\s*(.+?)\s*<\/p>/,
      );

      return {
        valid: true,
        name: nameMatch[1].trim(),
        membershipId: idMatch ? idMatch[1] : code,
        field: degreeMatch ? degreeMatch[1].trim() : undefined,
      };
    } catch (error) {
      this.logger.error('Failed to verify nezam code', error);
      return { valid: false };
    }
  }
}
