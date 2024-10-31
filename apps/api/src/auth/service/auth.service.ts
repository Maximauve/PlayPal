import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  login(user: User) {
    const payload: { id: string, username: string } = { username: user.username, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
      username: user.username,
      email: user.email
    };
  }
}
