import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { MyTherapistService } from "./my-therapist.service";
import { IntakeDto } from "./dto/intake.dto";
import { BookSessionDto } from "./dto/book-session.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
@Controller("my-therapist")
@UseGuards(JwtAuthGuard)
export class MyTherapistController {
  constructor(private readonly service: MyTherapistService) {}

  @Post("intake")
  submitIntake(@Req() req: any, @Body() dto: IntakeDto) {
    const userId = req.user?.id || req.user?.userId;
    return this.service.submitIntake(userId, dto);
  }

  @Get("intake/me")
  getMyIntake(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.service.getMyIntake(userId);
  }

  @Get("therapists")
  getTherapists(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.service.getTherapists(userId);
  }

  @Get("therapists/:id")
  getTherapist(@Req() req: any, @Param("id", new ParseUUIDPipe()) id: string) {
    const userId = req.user?.id || req.user?.userId;
    return this.service.getTherapistById(id, userId);
  }

  @Get("groups")
  getGroups(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.service.getGroups(userId);
  }

  @Get("groups/:id")
  getGroup(@Req() req: any, @Param("id", new ParseUUIDPipe()) id: string) {
    const userId = req.user?.id || req.user?.userId;
    return this.service.getGroupById(id, userId);
  }

  @Post("book")
  bookSession(@Req() req: any, @Body() dto: BookSessionDto) {
    const userId = req.user?.id || req.user?.userId;
    return this.service.bookSession(userId, dto);
  }

  @Post("groups/:groupId/join")
  joinGroup(
    @Req() req: any,
    @Param("groupId", new ParseUUIDPipe()) groupId: string,
  ) {
    const userId = req.user?.id || req.user?.userId;
    return this.service.joinGroup(userId, groupId);
  }
}
