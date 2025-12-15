/**
 * Service de gestion des paiements
 * Logique métier : création, traitement, validation des paiements
 * Gère l'intégration avec Stripe (simulée pour dev)
 */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { PaymentFactory } from '../entities/payment.factory';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentPublisher } from '../events/payment.publisher';
import { PaymentStatus, PaymentMethod } from './../../../../shared/enums';
import { canTransition } from '../entities/payment-status';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly paymentPublisher: PaymentPublisher,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const existingPayment = await this.findByTicketId(
      createPaymentDto.ticketId,
    );
    if (existingPayment) {
      throw new BadRequestException(
        `Payment already exists for ticket ${createPaymentDto.ticketId}`,
      );
    }

    if (createPaymentDto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const payment = PaymentFactory.createPendingPayment(
      createPaymentDto.ticketId,
      createPaymentDto.userId,
      createPaymentDto.amount,
      createPaymentDto.method,
    );

    return this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }
    return payment;
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByTicketId(ticketId: string): Promise<Payment | null> {
    return this.paymentRepository.findOne({
      where: { ticketId },
      order: { createdAt: 'DESC' },
    });
  }

  async processPaymentForTicket(
    ticketId: string,
    userId: string,
    amount: number,
  ): Promise<Payment> {
    const existingPayment = await this.findByTicketId(ticketId);
    if (existingPayment) {
      console.log(`Payment already exists for ticket ${ticketId}`);
      return existingPayment;
    }

    const payment = await this.create({
      ticketId,
      userId,
      amount,
      method: PaymentMethod.CREDIT_CARD,
    });

    this.paymentPublisher.publishPaymentInitiated({
      ticketId: payment.ticketId,
      paymentId: payment.id,
      userId: payment.userId,
      amount: Number(payment.amount),
      method: payment.method,
      initiatedAt: new Date(),
    });

    console.log(
      `Payment ${payment.id} created for ticket ${ticketId} - Awaiting processing`,
    );

    return payment;
  }

  async processPayment(paymentId: string): Promise<Payment> {
    const payment = await this.findOne(paymentId);

    if (!canTransition(payment.status, PaymentStatus.PROCESSING)) {
      throw new BadRequestException(
        `Cannot process payment: invalid transition from ${payment.status} to PROCESSING`,
      );
    }

    payment.status = PaymentStatus.PROCESSING;
    await this.paymentRepository.save(payment);

    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      if (!canTransition(payment.status, PaymentStatus.CONFIRMED)) {
        throw new BadRequestException(
          `Cannot confirm payment: invalid transition from ${payment.status} to CONFIRMED`,
        );
      }

      payment.status = PaymentStatus.CONFIRMED;
      payment.stripePaymentIntentId = `pi_mock_${Date.now()}`;
      await this.paymentRepository.save(payment);

      this.paymentPublisher.publishPaymentProcessed({
        ticketId: payment.ticketId,
        paymentId: payment.id,
        userId: payment.userId,
        amount: Number(payment.amount),
        status: PaymentStatus.CONFIRMED,
        method: payment.method,
        processedAt: new Date(),
      });

      console.log(`Payment ${paymentId} processed successfully`);
    } else {
      if (!canTransition(payment.status, PaymentStatus.FAILED)) {
        throw new BadRequestException(
          `Cannot fail payment: invalid transition from ${payment.status} to FAILED`,
        );
      }

      payment.status = PaymentStatus.FAILED;
      payment.errorMessage = 'Simulated payment failure for testing';
      await this.paymentRepository.save(payment);

      this.paymentPublisher.publishPaymentFailed({
        ticketId: payment.ticketId,
        paymentId: payment.id,
        userId: payment.userId,
        amount: Number(payment.amount),
        reason: payment.errorMessage,
        failedAt: new Date(),
      });

      console.log(`Payment ${paymentId} failed`);
    }

    return payment;
  }

  async refund(id: string): Promise<Payment> {
    const payment = await this.findOne(id);

    if (!canTransition(payment.status, PaymentStatus.REFUNDED)) {
      throw new BadRequestException(
        `Cannot refund payment: invalid transition from ${payment.status} to REFUNDED`,
      );
    }

    payment.status = PaymentStatus.REFUNDED;
    await this.paymentRepository.save(payment);

    this.paymentPublisher.publishPaymentRefunded({
      ticketId: payment.ticketId,
      paymentId: payment.id,
      userId: payment.userId,
      amount: Number(payment.amount),
      refundedAt: new Date(),
    });

    console.log(`Payment ${id} refunded successfully`);
    return payment;
  }
}
