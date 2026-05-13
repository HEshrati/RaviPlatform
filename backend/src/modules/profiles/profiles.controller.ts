import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import type { Request as ExpressRequest } from 'express';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads/avatars';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  /**
   * GET /api/profiles/me
   * دریافت پروفایل کاربر با فرمت camelCase مناسب برای فرانت‌اند
   */
  @Get('me')
  async getMyProfile(@Request() req) {
    let profile = await this.profilesService.findByUserIdSerialized(req.user.id);
    if (!profile) {
      // Auto-create empty profile (fixes first-time save issue)
      try {
        profile = await this.profilesService.create(req.user.id);
      } catch {
        // Profile might already exist in a race condition
        profile = await this.profilesService.findByUserIdSerialized(req.user.id);
      }
      if (!profile) {
        return {
          avatarUrl: null, bio: '', interests: [], city: '',
          age: null, gender: '', education: '', completionPercentage: 0,
        };
      }
    }
    return profile;
  }

  /**
   * PATCH /api/profiles/me
   * به‌روزرسانی پروفایل - فرانت می‌تواند education یا education_level بفرستد
   */
  @Patch('me')
  async updateMyProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.profilesService.update(req.user.id, updateProfileDto);
  }

  /**
   * POST /api/profiles/me/avatar
   * آپلود عکس پروفایل
   */
  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowed.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'فرمت فایل مجاز نیست. JPG، PNG یا WebP انتخاب کنید.',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('فایلی انتخاب نشده است');
    }

    const baseUrl =
      process.env.BACKEND_PUBLIC_URL || 'http://localhost:4000';
    const avatarUrl = `${baseUrl}/uploads/avatars/${file.filename}`;

    // حذف آواتار قدیمی
    const profile = await this.profilesService.findByUserId(req.user.id);
    if (profile?.avatar_url) {
      try {
        const oldFilename = profile.avatar_url.split('/').pop();
        const oldPath = `${UPLOAD_DIR}/${oldFilename}`;
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch {}
    }

    await this.profilesService.update(req.user.id, {
      avatar_url: avatarUrl,
    } as any);

    return { avatarUrl, message: 'عکس پروفایل با موفقیت آپلود شد' };
  }

  /**
   * POST /api/profiles/me/complete
   * تکمیل پروفایل
   */
  @Post('me/complete')
  async completeProfile(@Request() req) {
    const profile = await this.profilesService.completeProfile(req.user.id);
    return {
      message: 'پروفایل با موفقیت تکمیل شد',
      profile: {
        is_complete: true,
        completion_percentage: profile.completionPercentage,
      },
    };
  }
}
