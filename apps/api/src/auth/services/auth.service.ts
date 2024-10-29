import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.FindOneUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async Login(user: any) {
    const payload:{username: string, id: string} = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET })
    };
  }
}
