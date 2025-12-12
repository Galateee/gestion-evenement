/**
 * Service de publication d'événements vers RabbitMQ
 * Encapsule la logique de connexion et d'envoi de messages
 * Utilisé par TicketsService pour publier les événements métier
 */
import { Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { TicketBookedEvent, TicketCancelledEvent } from './ticket.events';

@Injectable()
export class EventPublisher {
  private readonly logger = new Logger(EventPublisher.name);
  private client: ClientProxy;

  constructor() {
    const rabbitmqUrl =
      process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672';
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: 'ticket_events',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('Connected to RabbitMQ');
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  publishTicketBooked(event: TicketBookedEvent): void {
    try {
      this.logger.debug(`Publishing ticket.booked: ${event.ticketId}`);
      this.client.emit('ticket.booked', event);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to publish ticket.booked: ${err.message}`);
    }
  }

  publishTicketCancelled(event: TicketCancelledEvent): void {
    try {
      this.logger.debug(`Publishing ticket.cancelled: ${event.ticketId}`);
      this.client.emit('ticket.cancelled', event);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to publish ticket.cancelled: ${err.message}`);
    }
  }
}
