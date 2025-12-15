import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Activer CORS pour que la Gateway puisse charger le JSON
  app.enableCors({
    origin: '*', // En production, mettre l'URL de la Gateway
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });


  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('Microservice for user management and authentication in the event platform')
    .setVersion('1.0')
    .addTag('users', 'User management operations')
    .addTag('Authentication', 'Authentication and authorization operations')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
