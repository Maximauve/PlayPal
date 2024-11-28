import { type Rule } from "@playpal/schemas";

export interface RequestWithRule extends Request {
  params: {
    gameId: string,
    ruleId: string,
  };
  rule?: Rule;
}
