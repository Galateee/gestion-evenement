import { IsString, IsEnum, IsDateString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventCategory } from './../../../../shared/enums/index';

export class CreateEventDto {
  @ApiProperty({
    example: 'Conférence Tech 2024',
    description: "Le titre de l'événement (max 200 caractères)"
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'Une conférence sur les nouvelles technologies...',
    description: "Description détaillée de l'événement"
  })
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiProperty({
    enum: EventCategory,
    description: "La catégorie de l'événement",
    example: EventCategory.CONFERENCE // Assurez-vous que cette valeur existe dans votre enum
  })
  @IsEnum(EventCategory)
  category: EventCategory;

  @ApiProperty({
    example: '2024-12-25T09:00:00Z',
    description: "Date de début au format ISO 8601"
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2024-12-25T18:00:00Z',
    description: "Date de fin au format ISO 8601"
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    example: 'Palais des Congrès, Paris',
    description: "Lieu de l'événement"
  })
  @IsString()
  @MaxLength(500)
  location: string;

  @ApiProperty({
    example: 100,
    description: "Capacité maximale de participants",
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({
    example: 50.00,
    description: "Prix de base du billet (optionnel, 0 par défaut)",
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: "URL de l'image de couverture"
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}