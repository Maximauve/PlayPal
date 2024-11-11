import { type User } from "@/user/user.entity";

export interface RequestWithUser extends Request {
  user?: User
}