/**
 * DTO pour la création d'un ticket
 * Valide les données d'entrée : eventId, type de ticket et quantité
 * userId optionnel (peut être fourni par l'API Gateway après authentification)
 */
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { TicketType } from './../../../../shared/enums/index';

export class CreateTicketDto {
  @IsUUID()
  eventId: string;

  @IsEnum(TicketType)
  ticketType: TicketType;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
