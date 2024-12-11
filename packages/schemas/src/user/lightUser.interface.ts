import { Role } from "./role.enum";

export interface LightUser {
	username: string;
	image: string;
	role: Role;
}
