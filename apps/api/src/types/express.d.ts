import { type JwtPayload } from '@playpal/schemas/jwt.interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}