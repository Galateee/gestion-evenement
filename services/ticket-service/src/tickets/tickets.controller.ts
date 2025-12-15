/**
 * Contrôleur REST pour la gestion des tickets
 * Endpoints: CRUD + confirm-payment et cancel
 * Routes:
 *   POST   /tickets           - Créer un ticket avec vérification de capacité
 *   GET    /tickets           - Lister tous les tickets
 *   GET    /tickets/:id       - Récupérer un ticket par ID
 *   PATCH  /tickets/:id       - Modifier un ticket (avec validation de transition)
 *   DELETE /tickets/:id       - Supprimer un ticket
 *   POST   /tickets/:id/confirm-payment - Confirmer le paiement
 *   POST   /tickets/:id/cancel - Annuler un ticket
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateTicketDto, @Req() req: Request) {
    const mockUserId = dto.userId ?? '550e8400-e29b-41d4-a716-446655440000';
    const mockUnitPrice = 10.0;
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.service.create(dto, mockUserId, mockUnitPrice, token);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }

  @Post(':id/confirm-payment')
  @UseGuards(JwtAuthGuard)
  async confirmPayment(@Param('id') id: string) {
    return this.service.confirmPayment(id);
  }

  @Get(':id/qrcode')
  @UseGuards(JwtAuthGuard)
  async getQRCode(@Param('id') id: string) {
    const ticket = await this.service.findOne(id);
    return {
      ticketId: ticket.id,
      qrCode: ticket.qrCode,
      status: ticket.status,
      eventId: ticket.eventId,
    };
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }
}
