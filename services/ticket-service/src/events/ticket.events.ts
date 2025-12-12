/**
 * Définition des événements métier du ticket-service
 * Ces événements sont publiés sur RabbitMQ pour communication asynchrone
 * avec payment-service et notification-service
 */

export interface TicketBookedEvent {
  eventName: 'ticket.booked';
  ticketId: string;
  eventId: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  ticketType: string;
  timestamp: Date;
}

export interface TicketCancelledEvent {
  eventName: 'ticket.cancelled';
  ticketId: string;
  eventId: string;
  userId: string;
  reason?: string;
  timestamp: Date;
}

export interface PaymentProcessedEvent {
  eventName: 'payment.processed';
  ticketId: string;
  paymentId: string;
  amount: number;
  timestamp: Date;
}

export interface PaymentFailedEvent {
  eventName: 'payment.failed';
  ticketId: string;
  paymentId?: string;
  reason: string;
  timestamp: Date;
}
