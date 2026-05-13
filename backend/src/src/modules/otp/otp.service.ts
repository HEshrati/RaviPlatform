import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { OtpEntity } from '../../database/entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
  ) {}

  async getRecentByMobile(mobileNumber: string): Promise<OtpEntity | null> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    return await this.otpRepository.findOne({
      where: {
        mobileNumber,
        createdAt: MoreThan(fiveMinutesAgo),
        isUsed: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async createOtp(mobileNumber: string, code: string): Promise<OtpEntity> {
    const otp = this.otpRepository.create({
      mobileNumber,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      isUsed: false,
    });
    
    return await this.otpRepository.save(otp);
  }

  async verifyOtp(mobileNumber: string, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: {
        mobileNumber,
        code,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!otp) {
      return false;
    }

    otp.isUsed = true;
    await this.otpRepository.save(otp);
    
    return true;
  }

  async resendOtp(mobileNumber: string): Promise<string> {
    const recentOtp = await this.getRecentByMobile(mobileNumber);
    
    if (recentOtp) {
      const timeLeft = Math.ceil((recentOtp.createdAt.getTime() + 5 * 60 * 1000 - Date.now()) / 1000);
      throw new BadRequestException(`Please wait ${timeLeft} seconds before requesting new OTP`);
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await this.createOtp(mobileNumber, otpCode);
    
    return otpCode;
  }
}