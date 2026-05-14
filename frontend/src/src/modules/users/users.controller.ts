import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsOptional } from 'class-validator';

class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('stats')
  async getMyStats(@Req() req: any) {
    return this.usersService.getUserStats(req.user.id);
  }

  /**
   * PATCH /api/users/me
   * Update current user's name / avatar
   */
  @Patch('me')
  async updateMe(@Req() req: any, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(req.user.id, body);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}
