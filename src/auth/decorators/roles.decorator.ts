import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../constants/roles.enum';

export const ROLES_KEY = 'role';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
