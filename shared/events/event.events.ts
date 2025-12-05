/**
 * Event-Driven Architecture - Domain Events
 * Ces événements permettent la communication asynchrone entre microservices
 */

export enum EventType {
  // Event Service Events
  EVENT_CREATED = 'event.created',
  EVENT_UPDATED = 'event.updated',
  EVENT_CANCELLED = 'event.cancelled',
  
  // Ticket Service Events
  TICKET_BOOKED = 'ticket.booked',
  TICKET_CANCELLED = 'ticket.cancelled',
  
  // Payment Service Events
  PAYMENT_PROCESSED = 'payment.processed',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',
  
  // Notification Service Events
  NOTIFICATION_SENT = 'notification.sent',
  
  // User Service Events
  USER_REGISTERED = 'user.registered',
  USER_UPDATED = 'user.updated',
}

// Base Event Interface
export interface BaseEvent {
  eventId: string;
  eventType: EventType;
  timestamp: Date;
  aggregateId: string;
  version: number;
}

// Event Service Events
export interface EventCreatedEvent extends BaseEvent {
  eventType: EventType.EVENT_CREATED;
  data: {
    eventId: string;
    title: string;
    description: string;
    category: string;
    organizerId: string;
    startDate: Date;
    endDate: Date;
    location: string;
    capacity: number;
  };
}

export interface EventUpdatedEvent extends BaseEvent {
  eventType: EventType.EVENT_UPDATED;
  data: {
    eventId: string;
    updatedFields: Record<string, any>;
  };
}

export interface EventCancelledEvent extends BaseEvent {
  eventType: EventType.EVENT_CANCELLED;
  data: {
    eventId: string;
    reason: string;
    cancelledBy: string;
  };
}

// Ticket Service Events
export interface TicketBookedEvent extends BaseEvent {
  eventType: EventType.TICKET_BOOKED;
  data: {
    ticketId: string;
    eventId: string;
    userId: string;
    ticketType: string;
    quantity: number;
    totalPrice: number;
  };
}

export interface TicketCancelledEvent extends BaseEvent {
  eventType: EventType.TICKET_CANCELLED;
  data: {
    ticketId: string;
    eventId: string;
    userId: string;
    reason: string;
  };
}

// Payment Service Events
export interface PaymentProcessedEvent extends BaseEvent {
  eventType: EventType.PAYMENT_PROCESSED;
  data: {
    paymentId: string;
    ticketId: string;
    userId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
  };
}

export interface PaymentFailedEvent extends BaseEvent {
  eventType: EventType.PAYMENT_FAILED;
  data: {
    paymentId: string;
    ticketId: string;
    userId: string;
    amount: number;
    reason: string;
  };
}

export interface PaymentRefundedEvent extends BaseEvent {
  eventType: EventType.PAYMENT_REFUNDED;
  data: {
    paymentId: string;
    refundId: string;
    originalAmount: number;
    refundAmount: number;
    reason: string;
  };
}

// Type union pour tous les événements
export type DomainEvent =
  | EventCreatedEvent
  | EventUpdatedEvent
  | EventCancelledEvent
  | TicketBookedEvent
  | TicketCancelledEvent
  | PaymentProcessedEvent
  | PaymentFailedEvent
  | PaymentRefundedEvent;
