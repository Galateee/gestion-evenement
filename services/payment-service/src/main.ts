/**
 * Point d'entrée du payment-service
 * Initialise l'application NestJS avec HTTP + RabbitMQ microservice
 * HTTP: REST API sur port configuré (défaut: 3003)
 * RabbitMQ: consommation d'événements ticket-service
 */
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const rabbitmqUrl =
    process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'ticket_events',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3003);

  console.log(`Payment-service running on port ${process.env.PORT ?? 3003}`);
  console.log(`RabbitMQ connected: ${rabbitmqUrl}`);
}
bootstrap();
