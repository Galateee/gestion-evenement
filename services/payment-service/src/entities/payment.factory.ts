/**
 * Factory pour créer des instances de Payment
 * Centralise la logique de création pour garantir la cohérence
 */
import { Payment } from './payment.entity';
import { PaymentStatus, PaymentMethod } from './../../../../shared/enums';

export class PaymentFactory {
  static createPendingPayment(
    ticketId: string,
    userId: string,
    amount: number,
    method: PaymentMethod = PaymentMethod.CREDIT_CARD,
  ): Payment {
    if (amount <= 0) {
      throw new Error('Le montant du paiement doit être positif');
    }

    const payment = new Payment();
    payment.ticketId = ticketId;
    payment.userId = userId;
    payment.amount = amount;
    payment.status = PaymentStatus.INITIATED;
    payment.method = method;

    return payment;
  }
}
