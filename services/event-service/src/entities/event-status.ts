/**
 * Machine à états pour les événements
 *
 * Flow complet selon la spécification :
 * DRAFT → PUBLISHED → ONGOING → COMPLETED/CANCELLED
 *
 * Transitions validées selon le diagramme fourni :
 * - DRAFT → PUBLISHED : Publication de l'événement
 * - PUBLISHED → ONGOING : Début de l'événement
 * - ONGOING → COMPLETED : Fin de l'événement (succès)
 * - DRAFT → CANCELLED : Annulation avant publication
 * - PUBLISHED → CANCELLED : Annulation après publication
 * - ONGOING → CANCELLED : Annulation pendant l'événement
 */
import { EventStatus } from './../../../../shared/enums';

const allowedTransitions: Record<EventStatus, EventStatus[]> = {
  [EventStatus.DRAFT]: [EventStatus.PUBLISHED, EventStatus.CANCELLED],

  [EventStatus.PUBLISHED]: [EventStatus.ONGOING, EventStatus.CANCELLED],

  [EventStatus.ONGOING]: [EventStatus.COMPLETED, EventStatus.CANCELLED],

  [EventStatus.COMPLETED]: [],

  [EventStatus.CANCELLED]: [],
};

export function canTransition(from: EventStatus, to: EventStatus): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export function getAvailableTransitions(from: EventStatus): EventStatus[] {
  return allowedTransitions[from] ?? [];
}
