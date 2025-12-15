import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('JwtAuthGuard activé');

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    try {
      const user = await this.authService.verifyUser(authHeader);
      request.user = user;
      console.log('Utilisateur authentifié:', user.email);
      return true;
    } catch (error) {
      console.log("Échec de l'authentification:", error.message);
      throw new UnauthorizedException("Token d'authentification requis");
    }
  }
}
