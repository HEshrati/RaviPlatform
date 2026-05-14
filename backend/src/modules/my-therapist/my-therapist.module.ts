import { ConsultationTopic } from './entities/consultation-topic.entity';
import { ConsultationFlowSession } from './entities/consultation-flow-session.entity';
import { ConsultationFlowService } from './consultation-flow.service';
import { ConsultationFlowController } from './consultation-flow.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyTherapistController } from './my-therapist.controller';
import { MyTherapistService } from './my-therapist.service';
import { TherapistProfile } from './entities/therapist-profile.entity';
import { SupportGroup } from './entities/support-group.entity';
import { MtIntakeResponse } from './entities/intake-response.entity';
import {
  TherapySessionBooking,
  SupportGroupMembership,
} from './entities/session-booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TherapistProfile,
      ConsultationTopic,
      ConsultationFlowSession,
      SupportGroup,
      MtIntakeResponse,
      TherapySessionBooking,
      SupportGroupMembership,
    ]),
  ],
  controllers: [
    ConsultationFlowController,MyTherapistController],
  providers: [
    ConsultationFlowService,MyTherapistService],
  exports: [MyTherapistService],
})
export class MyTherapistModule {}
