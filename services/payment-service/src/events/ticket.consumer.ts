/**
 * Consumer d'événements ticket depuis RabbitMQ
 * Écoute ticket.booked pour initier le processus de paiement
 */
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from '../payments/payments.service';

interface TicketBookedEvent {
  ticketId: string;
  eventId: string;
  userId: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
  bookedAt: Date;
}

@Controller()
export class TicketConsumer {
  constructor(private readonly paymentsService: PaymentsService) {}

  @EventPattern('ticket.booked')
  async handleTicketBooked(@Payload() data: TicketBookedEvent) {
    console.log('Received event: ticket.booked', data.ticketId);

    try {
      // Initier le processus de paiement automatiquement
      await this.paymentsService.processPaymentForTicket(
        data.ticketId,
        data.userId,
        data.totalPrice,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Error processing ticket.booked event:', errorMessage);
    }
  }
}
