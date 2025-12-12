/**
 * Factory pour la création de tickets
 * Encapsule la logique de création avec statut initial RESERVED
 * Calcule automatiquement le prix total et valide la quantité minimale
 */
import { Ticket } from './ticket.entity';
import { TicketStatus, TicketType } from './../../../../shared/enums/index';

interface CreateTicketParams {
  eventId: string;
  userId: string;
  ticketType: TicketType;
  quantity?: number;
  unitPrice: number;
  expiresAt?: Date;
}

export function createReservedTicket(params: CreateTicketParams): Ticket {
  const ticket = new Ticket();
  ticket.eventId = params.eventId;
  ticket.userId = params.userId;
  ticket.ticketType = params.ticketType;
  ticket.quantity = Math.max(1, params.quantity ?? 1);
  ticket.totalPrice = roundCurrency(ticket.quantity * params.unitPrice);
  ticket.status = TicketStatus.RESERVED;
  ticket.expiresAt = params.expiresAt;
  return ticket;
}

function roundCurrency(value: number): number {
  return Number(value.toFixed(2));
}
