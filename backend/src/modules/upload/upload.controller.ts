import {
  Controller, Post, UseInterceptors, UploadedFile,
  UseGuards, Req, BadRequestException, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

function isAdminUser(user: any): boolean {
  const ADMIN_PHONES = ['09929564895', '09356815523', '09933830958'];
  if (!user) return false;
  const raw = user?.mobileNumber || user?.phone_number || '';
  const phone = raw.replace(/[\s\-+]/g, '').replace(/^98/, '0');
  return ADMIN_PHONES.includes(phone);
}

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads/events';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post('event-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // اطمینان از وجود پوشه
          const dir = join(process.cwd(), 'uploads', 'events');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const uniqueName = `event-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('فقط فرمت‌های JPG, PNG, WebP مجاز است'), false);
        }
      },
    }),
  )
  async uploadEventImage(@UploadedFile() file: any, @Req() req: any) {
    if (!isAdminUser(req.user)) {
      throw new BadRequestException('دسترسی ادمین لازم است');
    }
    if (!file) {
      throw new BadRequestException('فایلی انتخاب نشده است');
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
    const imageUrl = `${BACKEND_URL}/uploads/events/${file.filename}`;


    return {
      success: true,
      imageUrl,
      filename: file.filename,
      size: file.size,
    };
  }
}
