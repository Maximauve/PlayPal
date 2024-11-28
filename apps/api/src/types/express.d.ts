import { type JwtPayload } from '@playpal/schemas';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
