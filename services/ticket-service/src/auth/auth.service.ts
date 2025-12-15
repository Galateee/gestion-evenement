import { Injectable, UnauthorizedException } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class AuthService {
  private readonly userServiceUrl = 'http://user-service:3005';

  async verifyUser(token?: string) {
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      console.log(' Vérification du token avec user-service...');
      const response = await fetch(`${this.userServiceUrl}/auth/verify`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      console.log('Status de la réponse:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Erreur de la réponse:', errorText);
        throw new UnauthorizedException('Token invalide');
      }

      const result: any = await response.json();
      console.log('Résultat de la vérification:', result);

      // The user-service should return user details if the token is valid
      return result;
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      throw new UnauthorizedException('Erreur de vérification du token');
    }
  }
}
