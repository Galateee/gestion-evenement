/**
 * Module de communication événementielle
 * - EventClient: communication HTTP avec event-service (vérification capacité)
 * - EventPublisher: publication d'événements RabbitMQ
 * Note: EventConsumer est dans TicketsModule pour éviter dépendance circulaire
 */
import { Module } from '@nestjs/common';
import { EventClient } from './event.client';
import { EventPublisher } from './event.publisher';

@Module({
  providers: [EventClient, EventPublisher],
  exports: [EventClient, EventPublisher],
})
export class EventsModule {}
