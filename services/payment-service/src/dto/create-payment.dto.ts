/**
 * DTO pour créer un paiement
 * Validation des données entrantes avec class-validator
 */
import {
  IsUUID,
  IsString,
  IsNumber,
  IsEnum,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { PaymentMethod } from './../../../../shared/enums';

export class CreatePaymentDto {
  @IsUUID('all')
  ticketId: string;

  @IsString()
  userId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod;
}
