import { SetMetadata } from '@nestjs/common';

import { type Role } from '@/user/role.enum';

export const rolesKey = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(rolesKey, roles);