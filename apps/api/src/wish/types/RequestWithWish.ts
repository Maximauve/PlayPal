import { type Wish } from "@/wish/wish.entity";

export interface RequestWithWish extends Request {
  params: {
    gameId: string;
    wishId: string;
  };
  wish?: Wish;
} 