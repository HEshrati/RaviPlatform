import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // payload.userId (نه payload.sub)
    const userId = payload.userId || payload.sub;
    if (!userId) throw new UnauthorizedException('توکن نامعتبر است');

    const user = await this.usersService.findById(userId);

    if (!user) throw new UnauthorizedException('کاربر یافت نشد');
    if (user.is_banned) throw new UnauthorizedException('حساب کاربری مسدود شده است');

    return { id: user.id, email: user.email, role: user.role, mobileNumber: user.mobileNumber };
  }
}
