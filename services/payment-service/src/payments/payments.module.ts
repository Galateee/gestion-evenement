/**
 * Module des paiements
 * Regroupe controller, service, entities et événements liés aux paiements
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from '../entities/payment.entity';
import { PaymentPublisher } from '../events/payment.publisher';
import { TicketConsumer } from '../events/ticket.consumer';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentsController, TicketConsumer],
  providers: [PaymentsService, PaymentPublisher, AuthService, JwtAuthGuard],
  exports: [PaymentsService],
})
export class PaymentsModule {}
