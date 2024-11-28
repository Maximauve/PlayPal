import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import { type RequestWithRating } from "@/rating/types/RequestWithRating";

export const RatingRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithRating>();
    return request.rating;
  },
);