/**
 * Controller REST pour la gestion des paiements
 * Endpoints HTTP pour créer, consulter et gérer les paiements
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.paymentsService.findByUserId(userId);
  }

  @Get('ticket/:ticketId')
  findByTicketId(@Param('ticketId', ParseUUIDPipe) ticketId: string) {
    return this.paymentsService.findByTicketId(ticketId);
  }

  @Post(':id/process')
  processPayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.processPayment(id);
  }

  @Post(':id/refund')
  refund(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.refund(id);
  }
}
