import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import { type RequestWithProduct } from "@/product/types/RequestWithProduct";

export const ProductRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithProduct>();
    return request.product;
  },
);