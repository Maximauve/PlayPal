import { type Rating } from "@playpal/schemas";

export interface RequestWithRating extends Request {
  params: {
    gameId: string
    ratingId: string
  };
  rating?: Rating;
}
