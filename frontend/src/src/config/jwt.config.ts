import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (): JwtModuleOptions => ({
  secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRATION || '24h',
  },
});
