/**
 * Gestion de la machine à états des tickets
 * Définit les transitions autorisées entre statuts (state machine)
 * Empêche les changements de statut invalides (ex: USED → PENDING_PAYMENT)
 */
import { TicketStatus } from './../../../../shared/enums/index';

/**
 * Transitions autorisées selon le diagramme de machine à états
 *
 * Flow nominal : RESERVED → PENDING_PAYMENT → PAID → VALIDATED → USED
 *
 * Cas d'échec possibles :
 * - RESERVED → CANCELLED (annulation avant paiement)
 * - PENDING_PAYMENT → EXPIRED (délai de paiement expiré)
 * - PENDING_PAYMENT → CANCELLED (annulation pendant l'attente)
 * - PAID → CANCELLED (demande de remboursement)
 * - VALIDATED → CANCELLED (annulation avant utilisation)
 */
const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  [TicketStatus.RESERVED]: [
    TicketStatus.PENDING_PAYMENT,
    TicketStatus.CANCELLED,
  ],
  [TicketStatus.PENDING_PAYMENT]: [
    TicketStatus.PAID,
    TicketStatus.EXPIRED,
    TicketStatus.CANCELLED,
  ],
  [TicketStatus.PAID]: [
    TicketStatus.VALIDATED,
    TicketStatus.EXPIRED,
    TicketStatus.CANCELLED,
  ],
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
