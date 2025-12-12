import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // CORS pour autoriser les requêtes frontend
  app.enableCors();

  // Utilise le port défini dans le .env ou 3000 par défaut
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`API Gateway is running on: http://localhost:${port}`);
  console.log(`- Events Service -> ${process.env.EVENT_SERVICE_URL}`);
  console.log(`- Users Service  -> ${process.env.USER_SERVICE_URL}`);
}
bootstrap();