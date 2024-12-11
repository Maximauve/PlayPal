import { Role } from "./role.enum";

export type JwtPayload = {
  id: string;
  email: string;
  username: string;
  role: Role;
}
