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
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.findOne(id);
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  findMyPayments(@CurrentUser('userId') userId: string) {
    return this.paymentsService.findByUserId(userId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.paymentsService.findByUserId(userId);
  }

  @Get('ticket/:ticketId')
  @UseGuards(JwtAuthGuard)
  findByTicketId(@Param('ticketId', ParseUUIDPipe) ticketId: string) {
    return this.paymentsService.findByTicketId(ticketId);
  }

  @Post(':id/process')
  @UseGuards(JwtAuthGuard)
  processPayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.processPayment(id);
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  refund(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.refund(id);
  }
}
