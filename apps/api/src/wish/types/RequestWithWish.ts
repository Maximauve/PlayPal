import { type Wish } from "@playpal/schemas";

export interface RequestWithWish extends Request {
  params: {
    gameId: string;
    wishId: string;
  };
  wish?: Wish;
} 
