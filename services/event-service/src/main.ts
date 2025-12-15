import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 1. IMPORTANT : Activez CORS pour que la Gateway puisse charger le JSON
  app.enableCors({
    origin: '*', // En production, mettez l'URL de la Gateway
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // --- CONFIGURATION SWAGGER (Début) ---
  const config = new DocumentBuilder()
    .setTitle('API Gestion des Événements') // Titre de votre API
    .setDescription('Documentation de l\'API pour la gestion des événements et réservations')
    .setVersion('1.0')
    .addBearerAuth() // Important : Active le bouton "Authorize" pour le JWT (cadenas)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger sera accessible sur l'URL /api
  SwaggerModule.setup('api', app, document);
  // --- CONFIGURATION SWAGGER (Fin) ---

  // Gestion robuste du port (convertit la string .env en nombre)
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}
bootstrap();