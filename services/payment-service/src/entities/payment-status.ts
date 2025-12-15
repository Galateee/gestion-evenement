/**
 * Machine à états pour les paiements
 *
 * Flow complet selon la spécification :
 * INITIATED → PROCESSING → CONFIRMED/FAILED
 *
 * CONFIRMED peut évoluer vers REFUNDED
 * Toutes les transitions peuvent évoluer vers CANCELLED
 *
 * Transitions validées selon le diagramme fourni :
 * - INITIATED → PROCESSING : Début du traitement du paiement
 * - PROCESSING → CONFIRMED : Paiement validé par le gateway
 * - PROCESSING → FAILED : Paiement refusé par le gateway
 * - CONFIRMED → REFUNDED : Remboursement demandé
 * - * → CANCELLED : Annulation possible à tout moment
 */
import { PaymentStatus } from './../../../../shared/enums';

const allowedTransitions: Record<PaymentStatus, PaymentStatus[]> = {
  [PaymentStatus.INITIATED]: [
    PaymentStatus.INITIATED,
    PaymentStatus.PROCESSING,
    PaymentStatus.CANCELLED,
  ],

  [PaymentStatus.PROCESSING]: [
    PaymentStatus.CONFIRMED,
    PaymentStatus.FAILED,
    PaymentStatus.CANCELLED,
  ],

  [PaymentStatus.CONFIRMED]: [PaymentStatus.REFUNDED],

  [PaymentStatus.FAILED]: [],

  [PaymentStatus.REFUNDED]: [],

  [PaymentStatus.CANCELLED]: [],
};

export function canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export function getAvailableTransitions(from: PaymentStatus): PaymentStatus[] {
  return allowedTransitions[from] ?? [];
}
