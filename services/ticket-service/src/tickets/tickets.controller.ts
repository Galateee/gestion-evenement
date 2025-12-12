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
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Post()
  async create(@Body() dto: CreateTicketDto) {
    const mockUserId = dto.userId ?? '00000000-0000-0000-0000-000000000001';
    const mockUnitPrice = 10.0;
    return this.service.create(dto, mockUserId, mockUnitPrice);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }

  @Post(':id/confirm-payment')
  async confirmPayment(@Param('id') id: string) {
    return this.service.confirmPayment(id);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }
}
