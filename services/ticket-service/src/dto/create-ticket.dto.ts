import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { TicketType } from '../../../../shared/enums/index.js';

export class CreateTicketDto {
  @IsUUID()
  eventId: string;

  @IsEnum(TicketType)
  ticketType: TicketType;

  @IsInt()
  @Min(1)
  quantity: number;

  // Optionnel: permet au gateway ou à un job de système de fournir l'identité
  @IsOptional()
  @IsUUID()
  userId?: string;
}
