import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import { type RequestWithWish } from "@/wish/types/RequestWithWish";


export const Wish = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithWish>();
    return request.wish;
  },
);