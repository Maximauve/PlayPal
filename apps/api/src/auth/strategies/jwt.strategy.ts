import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { type JwtPayload } from '@playpal/schemas';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private static extractJWT(this: void, request: Request): string | null {
    if (
      request.cookies &&
      'access_token' in request.cookies &&
      request.cookies.access_token.length > 0
    ) {
      return request.cookies.access_token as string;
    }
    return null;
  }

  validate(payload: JwtPayload) {
    return { id: payload.id, username: payload.username, email: payload.email };
  }
}
