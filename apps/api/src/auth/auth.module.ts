import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { forwardRef } from '@nestjs/common/utils';

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
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtStrategy],
  })
export class AuthModule {}
