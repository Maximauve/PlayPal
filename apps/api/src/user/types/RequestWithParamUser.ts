import { type User } from "@/user/user.entity";

export interface RequestWithParamUser extends Request {
  params: {
    userId: string
  };
  user?: User;
}