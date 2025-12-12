/**
 * Gestion de la machine à états des tickets
 * Définit les transitions autorisées entre statuts (state machine)
 * Empêche les changements de statut invalides (ex: USED → PENDING_PAYMENT)
 */
import { TicketStatus } from './../../../../shared/enums/index';

const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  [TicketStatus.RESERVED]: [
    TicketStatus.PENDING_PAYMENT,
    TicketStatus.CANCELLED,
    TicketStatus.EXPIRED,
  ],
  [TicketStatus.PENDING_PAYMENT]: [
    TicketStatus.PAID,
    TicketStatus.CANCELLED,
    TicketStatus.EXPIRED,
  ],
  [TicketStatus.PAID]: [TicketStatus.VALIDATED, TicketStatus.CANCELLED],
  [TicketStatus.VALIDATED]: [TicketStatus.USED, TicketStatus.CANCELLED],
  [TicketStatus.USED]: [],
  [TicketStatus.CANCELLED]: [],
  [TicketStatus.EXPIRED]: [],
};

export function canTransition(from: TicketStatus, to: TicketStatus): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export function isFinal(status: TicketStatus): boolean {
  return (
    status === TicketStatus.USED ||
    status === TicketStatus.CANCELLED ||
    status === TicketStatus.EXPIRED
  );
}
