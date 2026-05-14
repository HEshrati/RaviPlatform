/**
 * BehaviorTrackingInterceptor
 * هر درخواست API را به صورت خودکار ثبت می‌کند
 * کافی است فقط یک بار در app.module.ts یا main.ts ثبت شود
 * مسیر: src/common/interceptors/behavior-tracking.interceptor.ts
 */
import {
  Injectable, NestInterceptor, ExecutionContext,
  CallHandler, Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CrmService } from '../../modules/crm/crm.service';
import { BehaviorEventType, EventSeverity } from '../../modules/crm/entities/user-behavior-event.entity';

/** endpoint هایی که نباید ثبت شوند (برای جلوگیری از حلقه) */
const SKIP_PATHS = [
  '/api/crm/',
  '/api/health',
  '/uploads/',
  '/favicon',
];

@Injectable()
export class BehaviorTrackingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(BehaviorTrackingInterceptor.name);

  constructor(private readonly crmService: CrmService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const endpoint: string = req.url || '';

    // skip برای endpoint های خاص
    if (SKIP_PATHS.some(p => endpoint.includes(p))) {
      return next.handle();
    }

    const startTime = Date.now();
    const userId: string | null = req.user?.id ?? null;
    const sessionId: string | null =
      req.headers?.['x-session-id'] ?? req.cookies?.['session_id'] ?? null;
    const ipAddress: string =
      req.ip || req.headers?.['x-forwarded-for']?.split(',')[0] || '';
    const userAgent: string = req.headers?.['user-agent'] || '';
    const method: string = req.method;

    return next.handle().pipe(
      tap((responseBody) => {
        const responseTimeMs = Date.now() - startTime;
        const httpStatus = context.switchToHttp().getResponse().statusCode;

        // رویداد موفق
        this.crmService.track({
          userId,
          eventType: BehaviorEventType.API_CALL,
          severity: httpStatus >= 400 ? EventSeverity.ERROR : EventSeverity.INFO,
          apiEndpoint: `${method} ${endpoint.split('?')[0]}`,
          httpStatus,
          responseTimeMs,
          sessionId,
          ipAddress,
          userAgent,
          metadata: {
            query: req.query,
            slow: responseTimeMs > 2000,
          },
        });
      }),
      catchError((err) => {
        const responseTimeMs = Date.now() - startTime;
        const httpStatus = err.status || 500;

        // رویداد خطا
        this.crmService.track({
          userId,
          eventType: BehaviorEventType.API_ERROR,
          severity: EventSeverity.ERROR,
          apiEndpoint: `${method} ${endpoint.split('?')[0]}`,
          httpStatus,
          responseTimeMs,
          sessionId,
          ipAddress,
          userAgent,
          metadata: {
            error: err.message,
            stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
          },
        });

        return throwError(() => err);
      }),
    );
  }
}
