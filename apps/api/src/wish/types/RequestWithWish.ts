import { type Wish } from "@playpal/schemas";

export interface RequestWithWish extends Request {
  params: {
    wishId: string;
  };
  wish?: Wish;
} 
