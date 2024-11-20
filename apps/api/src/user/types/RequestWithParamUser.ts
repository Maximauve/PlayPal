import { type User } from "@playpal/schemas";

export interface RequestWithParamUser extends Request {
  params: {
    userId: string
  };
  user?: User;
}
