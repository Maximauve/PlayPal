import { type JwtPayload } from '@/auth/dto/jwtPayload';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; 
    }
  }
}