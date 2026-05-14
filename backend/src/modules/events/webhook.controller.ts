import { Controller, Post, Body, Headers, UnauthorizedException, HttpCode } from '@nestjs/common';

/**
 * Webhook endpoints for N8N workflow integration
 * These endpoints receive callbacks from N8N workflows
 */
@Controller('webhooks')
export class WebhookController {
  private readonly sharedSecret = process.env.N8N_SHARED_SECRET || 'ravi-n8n-secret-2024';

  private verify(secret: string) {
    if (secret !== this.sharedSecret) {
      throw new UnauthorizedException('توکن نامعتبر است');
    }
  }

  /**
   * POST /api/webhooks/n8n
   * General N8N webhook for match completion notifications
   */
  @Post('n8n')
  @HttpCode(200)
  async n8nWebhook(
    @Body() payload: any,
    @Headers('x-n8n-secret') secret: string,
  ) {
    this.verify(secret || '');
    return { success: true, received: true };
  }

  /**
   * POST /api/webhooks/n8n/store-vector
   * Store vector embeddings from AI enrichment workflow
   */
  @Post('n8n/store-vector')
  @HttpCode(200)
  async storeVector(
    @Body() payload: any,
    @Headers('x-n8n-secret') secret: string,
  ) {
    this.verify(secret || '');
    // TODO: Store in pgvector when available
    return { success: true, stored: true };
  }
}
