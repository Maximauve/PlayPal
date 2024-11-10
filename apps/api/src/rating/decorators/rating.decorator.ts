import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import { type RequestWithRating } from "@/rating/types/RequestWithRating";

export const Rating = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithRating>();
    return request.rating;
  },
);