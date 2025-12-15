/**
 * Module métier principal du ticket-service
 * Gère l'entité Ticket, le contrôleur et le service
 * Importe EventsModule pour la communication avec event-service et RabbitMQ
 * Inclut EventConsumer pour écouter les événements payment-service
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { EventsModule } from '../events/events.module';
import { EventConsumer } from '../events/event.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), EventsModule],
  providers: [TicketsService],
  controllers: [TicketsController, EventConsumer],
  exports: [TicketsService],
})
export class TicketsModule {}
