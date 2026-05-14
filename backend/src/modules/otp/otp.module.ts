import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { OtpEntity } from '../../database/entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
