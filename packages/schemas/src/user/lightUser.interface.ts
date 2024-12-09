import { Role } from "./role.enum";

export interface LightUser {
	username: string;
	profilePicture: string;
	role: Role;
}
