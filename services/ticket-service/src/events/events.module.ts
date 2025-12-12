/**
 * Module de communication avec l'event-service
 * Exporte EventClient pour vérifier la disponibilité des places
 * Utilisé par TicketsService pour les contrôles de capacité
 */
import { Module } from '@nestjs/common';
import { EventClient } from './event.client';

@Module({
  providers: [EventClient],
  exports: [EventClient],
})
export class EventsModule {}
