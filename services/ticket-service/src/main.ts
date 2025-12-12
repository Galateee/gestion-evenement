/**
 * Point d'entrée du ticket-service
 * Initialise l'application NestJS et démarre le serveur HTTP
 * sur le port configuré (défaut: 3002)
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
