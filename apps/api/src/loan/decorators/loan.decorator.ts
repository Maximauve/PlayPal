import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import { type RequestWithLoan } from "@/loan/types/RequestWithLoan";

export const Loan = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithLoan>();
    return request.loan;
  },
);