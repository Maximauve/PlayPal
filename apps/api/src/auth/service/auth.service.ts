import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type JwtPayload, User } from '@playpal/schemas';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) { }

  login(user: User) {
    const payload: JwtPayload = { username: user.username, id: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload as object, { secret: process.env.JWT_SECRET })
    };
  }
}
