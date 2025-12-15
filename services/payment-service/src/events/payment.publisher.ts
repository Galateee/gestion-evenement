/**
 * Publisher d'événements de paiement vers RabbitMQ
 * Émet les événements payment.initiated, payment.processed, payment.failed et payment.refunded
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import {
  PaymentInitiatedEvent,
  PaymentProcessedEvent,
  PaymentFailedEvent,
  PaymentRefundedEvent,
} from './payment.events';

@Injectable()
export class PaymentPublisher implements OnModuleInit {
  private client: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672',
        ],
        queue: 'payment_events',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  publishPaymentInitiated(event: PaymentInitiatedEvent): void {
    this.client.emit('payment.initiated', event);
    console.log('Event published: payment.initiated', event.paymentId);
  }

  publishPaymentProcessed(event: PaymentProcessedEvent): void {
    this.client.emit('payment.processed', event);
    console.log('Event published: payment.processed', event.paymentId);
  }

  publishPaymentFailed(event: PaymentFailedEvent): void {
    this.client.emit('payment.failed', event);
    console.log('Event published: payment.failed', event.paymentId);
  }

  publishPaymentRefunded(event: PaymentRefundedEvent): void {
    this.client.emit('payment.refunded', event);
    console.log('Event published: payment.refunded', event.paymentId);
  }
}
