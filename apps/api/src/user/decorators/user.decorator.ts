import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import { type RequestWithParamUser } from "@/user/types/RequestWithParamUser";

export const UserRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithParamUser>();
    return request.user;
  },
);