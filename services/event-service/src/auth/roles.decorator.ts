import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../../shared/enums'; // adapte le chemin si besoin

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);