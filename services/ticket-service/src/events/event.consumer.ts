/**
 * Consumer d'événements RabbitMQ pour le ticket-service
 * Écoute les événements du payment-service (payment.processed, payment.failed)
 * Met à jour le statut des tickets en conséquence
 */
import { Injectable, Logger } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TicketsService } from '../tickets/tickets.service';
import { PaymentProcessedEvent, PaymentFailedEvent } from './ticket.events';

@Controller()
@Injectable()
export class EventConsumer {
  private readonly logger = new Logger(EventConsumer.name);

  constructor(private readonly ticketsService: TicketsService) {}

  @EventPattern('payment.processed')
  async handlePaymentProcessed(@Payload() event: any) {
    const paymentEvent = event as PaymentProcessedEvent;
    this.logger.log(
      `Received payment.processed for ticket ${paymentEvent.ticketId}`,
    );
    try {
      await this.ticketsService.confirmPayment(paymentEvent.ticketId);
      this.logger.log(`Ticket ${paymentEvent.ticketId} marked as PAID`);
    } catch (error) {
      this.logger.error(
        `Failed to process payment.processed: ${(error as Error).message}`,
      );
    }
  }

  @EventPattern('payment.initiated')
  async handlePaymentInitiated(@Payload() event: any) {
    this.logger.log(`Received payment.initiated for ticket ${event.ticketId}`);
    try {
      await this.ticketsService.setAsPendingPayment(event.ticketId);
      this.logger.log(`Ticket ${event.ticketId} marked as PENDING_PAYMENT`);
    } catch (error) {
      this.logger.error(
        `Failed to process payment.initiated: ${(error as Error).message}`,
      );
    }
  }

  @EventPattern('payment.failed')
  async handlePaymentFailed(@Payload() event: any) {
    const paymentEvent = event as PaymentFailedEvent;
    this.logger.log(
      `Received payment.failed for ticket ${paymentEvent.ticketId}`,
    );
    try {
      await this.ticketsService.cancel(paymentEvent.ticketId);
      this.logger.log(
        `Ticket ${paymentEvent.ticketId} cancelled due to payment failure`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process payment.failed: ${(error as Error).message}`,
      );
    }
  }

  @EventPattern('payment.refunded')
  async handlePaymentRefunded(@Payload() event: any) {
    this.logger.log(`Received payment.refunded for ticket ${event.ticketId}`);
    try {
      await this.ticketsService.cancel(event.ticketId);
      this.logger.log(
        `Ticket ${event.ticketId} cancelled due to payment refund`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process payment.refunded: ${(error as Error).message}`,
      );
    }
  }
}
