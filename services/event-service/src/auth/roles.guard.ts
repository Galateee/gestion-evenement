import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../../../../shared/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // if no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Si pas d'user (pas de token), on INJECTE le user de démo DANS LA REQUÊTE
    if (!request.user) {
      request.user = {
        id: 'demo-user',
        role: UserRole.ADMIN,
      };
    }

    // Maintenant request.user existe forcément
    return requiredRoles.includes(request.user.role);

    /* FINAL VERSION  when auth is set up

    const request = context.switchToHttp().getRequest();
    const user = request.user; // rempli par ton AuthGuard / gateway

    if (!user || !user.role) {
      return false; // ou throw new ForbiddenException();
    }

    return requiredRoles.includes(user.role);
    */
  }
}
