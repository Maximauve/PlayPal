import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import { type RequestWithRule } from "@/rule/types/RequestWithRule";

export const RuleRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithRule>();
    return request.rule;
  },
);