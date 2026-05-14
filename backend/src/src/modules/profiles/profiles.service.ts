import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

/**
 * تبدیل Profile entity به فرمت مورد انتظار فرانت‌اند (camelCase)
 */
function serializeProfile(profile: Profile) {
  return {
    avatarUrl: profile.avatar_url ?? null,
    bio: profile.bio ?? '',
    interests: profile.interests ?? [],
    city: profile.city ?? '',
    age: profile.age ?? null,
    gender: profile.gender ?? '',
    education: profile.education_level ?? '',
    // فیلدهای اضافی
    firstName: profile.first_name ?? '',
    lastName: profile.last_name ?? '',
    maritalStatus: profile.marital_status ?? '',
    educationLevel: profile.education_level ?? '',
    completionPercentage: profile.profile_completion_percentage,
    isPublic: profile.is_public,
    profileViews: profile.profile_views,
    updatedAt: profile.updated_at,
  };
}

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async create(userId: string): Promise<any> {
    const profile = this.profilesRepository.create({
      user_id: userId,
      profile_completion_percentage: 0,
      interests: [],
    });
    const saved = await this.profilesRepository.save(profile);
    return serializeProfile(saved);
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return await this.profilesRepository.findOne({
      where: { user_id: userId },
    });
  }

  async findByUserIdSerialized(userId: string): Promise<any | null> {
    const profile = await this.findByUserId(userId);
    if (!profile) return null;
    return serializeProfile(profile);
  }

  async update(userId: string, data: UpdateProfileDto): Promise<any> {
    let profile = await this.findByUserId(userId);

    // ✅ Auto-create profile if it doesn't exist (fixes "not saving in dev mode" bug)
    if (!profile) {
      profile = this.profilesRepository.create({
        user_id: userId,
        profile_completion_percentage: 0,
        interests: [],
      });
    }

    // Map education (فرانت) → education_level (دیتابیس)
    if (data.education !== undefined && data.education_level === undefined) {
      data.education_level = data.education;
    }

    // اعمال تغییرات با نادیده گرفتن فیلد education (که alias است)
    const { education, ...rest } = data;
    Object.assign(profile, rest);

    profile.profile_completion_percentage = this.calculateCompletion(profile);

    const saved = await this.profilesRepository.save(profile);
    
    // Log successful save for debugging
    
    return serializeProfile(saved);
  }

  async completeProfile(userId: string): Promise<any> {
    const profile = await this.findByUserId(userId);

    if (!profile) {
      throw new NotFoundException('پروفایل یافت نشد');
    }

    profile.profile_completion_percentage = 100;
    const saved = await this.profilesRepository.save(profile);
    return serializeProfile(saved);
  }

  private calculateCompletion(profile: Profile): number {
    let score = 0;
    const fields = [
      'first_name',
      'last_name',
      'gender',
      'birth_date',
      'city',
      'bio',
      'education_level',
      'age',
    ];

    fields.forEach((field) => {
      if (profile[field] !== null && profile[field] !== undefined && profile[field] !== '') {
        score += 100 / fields.length;
      }
    });

    // interests امتیاز جداگانه
    if (profile.interests && profile.interests.length > 0) {
      score = Math.min(100, score + 5);
    }

    return Math.round(score);
  }
}
