import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import { type RequestWithGame } from "@/game/types/RequestWithGame";

export const GameRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithGame>();
    return request.game;
  },
);