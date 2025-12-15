/**
 * Enums partagés entre tous les microservices
 */

export enum UserRole {
  PARTICIPANT = 'PARTICIPANT',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

export enum EventCategory {
  CONFERENCE = 'CONFERENCE',
  CONCERT = 'CONCERT',
  FORMATION = 'FORMATION',
  SPORT = 'SPORT',
  SEMINAR = 'SEMINAR',
  OTHER = 'OTHER',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TicketType {
  VIP = 'VIP',
  STANDARD = 'STANDARD',
  EARLY_BIRD = 'EARLY_BIRD',
  FREE = 'FREE',
}

export enum TicketStatus {
  RESERVED = 'RESERVED',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  VALIDATED = 'VALIDATED',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  PROCESSING = 'PROCESSING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum NotificationType {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}
