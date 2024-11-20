import { type User } from "@playpal/schemas";

export interface RequestWithUser extends Request {
  user?: User
}
