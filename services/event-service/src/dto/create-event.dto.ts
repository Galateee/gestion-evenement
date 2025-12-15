import { IsString, IsEnum, IsDateString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';
import { EventCategory } from '../../../../shared/enums/index';

export class CreateEventDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsEnum(EventCategory)
  category: EventCategory;

  // @IsString()
  // organizerId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @MaxLength(500)
  location: string;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
