import { IsString, IsEnum, IsDateString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventCategory, EventStatus } from './../../../../shared/enums/index';

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Conférence Tech 2024 - Mis à jour' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'Nouvelle description...' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ enum: EventCategory })
  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  // Note : C'est un peu inhabituel de passer l'organizerId dans le body d'update 
  // (souvent géré par le token JWT), mais je le documente tel quel.
  @ApiProperty({
    description: "ID de l'organisateur (requis pour validation)",
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  organizerId: string;

  @ApiPropertyOptional({ enum: EventStatus, description: "Nouveau statut de l'événement" })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiPropertyOptional({ example: '2024-12-26T09:00:00Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-12-26T18:00:00Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Lyon, France' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @ApiPropertyOptional({ example: 200, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ example: 45.00, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({ example: 'https://example.com/new-image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}