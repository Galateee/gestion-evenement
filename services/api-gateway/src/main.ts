import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // CORS pour autoriser les requêtes frontend
  app.enableCors();

  // Configuration vide pour initialiser l'UI Swagger sur la Gateway
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // C'est ICI la magie : on dit à Swagger d'aller chercher la doc des autres
  SwaggerModule.setup('api', app, document, {
    explorer: true,
    swaggerOptions: {
      urls: [
        { url: 'http://localhost:3005/api-json', name: 'Service Users' },
        {
          url: 'http://localhost:3001/api-json', // L'URL du JSON du microservice à changer en prod
          name: 'Service Événements'
        }
        // { url: 'http://localhost:3002/api-json', name: 'Service Tickets' },
        // { url: 'http://localhost:3003/api-json', name: 'Service Payements' },
        // { url: 'http://localhost:3004/api-json', name: 'Service Notifications' }
      ],
    },
  });

  // Utilise le port défini dans le .env ou 3000 par défaut
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`API Gateway is running on: http://localhost:${port}`);
  console.log(`- Events Service -> ${process.env.EVENT_SERVICE_URL}`);
  console.log(`- Users Service  -> ${process.env.USER_SERVICE_URL}`);
}
bootstrap();