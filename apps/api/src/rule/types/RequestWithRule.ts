import { type Rule } from "@/rule/rule.entity";

export interface RequestWithRule extends Request {
  params: {
    gameId: string,
    ruleId: string,
  };
  rule?: Rule;
}