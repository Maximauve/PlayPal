import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@/auth/controller/auth.controller';
import { AuthService } from '@/auth/service/auth.service';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { TranslationService } from '@/translation/translation.service';
import { UsersModule } from '@/user/user.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2629800s' },
    }),
  ],
  controllers: [AuthController], 
  providers: [AuthService, JwtStrategy, TranslationService],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
