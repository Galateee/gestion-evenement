/**
 * Définition des événements émis par le payment-service
 * Ces événements sont publiés sur RabbitMQ pour communication asynchrone
 */
import { PaymentStatus, PaymentMethod } from './../../../../shared/enums';

export interface PaymentInitiatedEvent {
  ticketId: string;
  paymentId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  initiatedAt: Date;
}

export interface PaymentProcessedEvent {
  ticketId: string;
  paymentId: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  processedAt: Date;
}

export interface PaymentFailedEvent {
  ticketId: string;
  paymentId: string;
  userId: string;
  amount: number;
  reason: string;
  failedAt: Date;
}

export interface PaymentRefundedEvent {
  ticketId: string;
  paymentId: string;
  userId: string;
  amount: number;
  refundedAt: Date;
}
