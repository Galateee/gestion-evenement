/**
 * DTO pour la mise à jour d'un ticket
 * Tous les champs sont optionnels pour permettre des modifications partielles
 * Permet de changer le type, la quantité, le statut et le QR code
 */
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { TicketStatus, TicketType } from './../../../../shared/enums/index';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(TicketType)
  ticketType?: TicketType;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsString()
  qrCode?: string;

  @IsOptional()
  @IsUUID('all')
  eventId?: string;

  @IsOptional()
  @IsUUID('all')
  userId?: string;
}
