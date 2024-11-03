import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type JwtPayload } from '@playpal/schemas/jwt.interface';

import { User } from '@/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) { }

  login(user: User) {
    const payload: JwtPayload = { username: user.username, id: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET })
    };
  }
}
