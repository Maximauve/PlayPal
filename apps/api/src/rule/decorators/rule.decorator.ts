import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import { type RequestWithTag } from "@/tag/types/RequestWithTag";

export const TagRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithTag>();
    return request.tag;
  },
);