/**
 * Service métier pour la gestion des tickets
 * Logique principale:
 *   - Création avec vérification de capacité événement (appel event-service)
 *   - Comptage des tickets actifs pour éviter surréservation
 *   - Validation des transitions de statut (machine à états)
 *   - CRUD complet avec gestion d'erreurs
 * Responsable de la cohérence des données et des règles métier
 */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { TicketStatus } from './../../../../shared/enums/index';
import { createReservedTicket } from '../entities/ticket.factory';
import { canTransition } from '../entities/ticket-status';
import { EventClient } from '../events/event.client';
import { EventPublisher } from '../events/event.publisher';
import { generateQRCode } from '../utils/qr-code.generator';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly repo: Repository<Ticket>,
    private readonly eventClient: EventClient,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async create(
    dto: CreateTicketDto,
    userId: string,
    unitPrice: number,
    token?: string,
  ): Promise<Ticket> {
    const availableSeats = await this.eventClient.getAvailableSeats(
      dto.eventId,
      token,
    );
    if (availableSeats < dto.quantity) {
      throw new BadRequestException(
        `Insufficient seats. Available: ${availableSeats}, Requested: ${dto.quantity}`,
      );
    }

    const totalQuantityBooked = await this.countActiveTicketsForEvent(
      dto.eventId,
    );

    if (totalQuantityBooked + dto.quantity > availableSeats) {
      throw new BadRequestException(
        `Insufficient capacity. Booked: ${totalQuantityBooked}, Available: ${availableSeats}, Requested: ${dto.quantity}`,
      );
    }

    const ticket = createReservedTicket({
      eventId: dto.eventId,
      userId: userId,
      ticketType: dto.ticketType,
      quantity: dto.quantity,
      unitPrice,
    });
    const savedTicket = await this.repo.save(ticket);

    const qrCode = await generateQRCode(
      savedTicket.id,
      savedTicket.eventId,
      savedTicket.userId,
    );
    savedTicket.qrCode = qrCode;
    await this.repo.save(savedTicket);

    this.eventPublisher.publishTicketBooked({
      eventName: 'ticket.booked',
      ticketId: savedTicket.id,
      eventId: savedTicket.eventId,
      userId: savedTicket.userId,
      quantity: savedTicket.quantity,
      totalPrice: savedTicket.totalPrice,
      ticketType: savedTicket.ticketType,
      timestamp: new Date(),
    });

    return savedTicket;
  }

  async findAll(): Promise<Ticket[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Ticket> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Ticket not found');
    return found;
  }

  async update(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (dto.quantity && dto.quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    if (dto.status && !canTransition(ticket.status, dto.status)) {
      throw new BadRequestException(
        `Invalid status transition from ${ticket.status} to ${dto.status}`,
      );
    }

    if (dto.ticketType) ticket.ticketType = dto.ticketType;
    if (dto.quantity) ticket.quantity = dto.quantity;
    if (dto.qrCode !== undefined) ticket.qrCode = dto.qrCode;
    if (dto.status) ticket.status = dto.status;

    return this.repo.save(ticket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.repo.remove(ticket);
  }

  async setAsPendingPayment(id: string): Promise<Ticket> {
    const ticket = await this.findOne(id);
    if (!canTransition(ticket.status, TicketStatus.PENDING_PAYMENT)) {
      throw new BadRequestException(
        'Cannot set as pending payment from current status',
      );
    }
    ticket.status = TicketStatus.PENDING_PAYMENT;
    return this.repo.save(ticket);
  }

  async confirmPayment(id: string): Promise<Ticket> {
    const ticket = await this.findOne(id);
    if (!canTransition(ticket.status, TicketStatus.PAID)) {
      throw new BadRequestException(
        'Cannot confirm payment from current status',
      );
    }
    ticket.status = TicketStatus.PAID;

    // Générer/Renouveler le QR code au paiement confirmé
    if (!ticket.qrCode) {
      const qrCode = await generateQRCode(
        ticket.id,
        ticket.eventId,
        ticket.userId,
      );
      ticket.qrCode = qrCode;
    }

    return this.repo.save(ticket);
  }

  async cancel(id: string): Promise<Ticket> {
    const ticket = await this.findOne(id);
    if (!canTransition(ticket.status, TicketStatus.CANCELLED)) {
      throw new BadRequestException('Cannot cancel from current status');
    }
    ticket.status = TicketStatus.CANCELLED;
    const cancelledTicket = await this.repo.save(ticket);

    this.eventPublisher.publishTicketCancelled({
      eventName: 'ticket.cancelled',
      ticketId: cancelledTicket.id,
      eventId: cancelledTicket.eventId,
      userId: cancelledTicket.userId,
      timestamp: new Date(),
    });

    return cancelledTicket;
  }

  private async countActiveTicketsForEvent(eventId: string): Promise<number> {
    const activeTickets = await this.repo.find({
      where: [
        { eventId, status: TicketStatus.RESERVED },
        { eventId, status: TicketStatus.PENDING_PAYMENT },
        { eventId, status: TicketStatus.PAID },
        { eventId, status: TicketStatus.VALIDATED },
        { eventId, status: TicketStatus.USED },
      ],
    });

    return activeTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  }
}
