import { type Rating } from "@/rating/rating.entity";

export interface RequestWithRating extends Request {
  params: {
    gameId: string
    ratingId: string
  };
  rating?: Rating;
}