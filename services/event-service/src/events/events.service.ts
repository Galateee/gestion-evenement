import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { FilterEventDto } from '../dto/filter-event.dto';
import { EventStatus } from '../../../../shared/enums';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) { }

    async create(createEventDto: CreateEventDto): Promise<Event> {
        const event = this.eventRepository.create({
            ...createEventDto,
            // À la création, les places disponibles sont égales à la capacité
            availableSeats: createEventDto.capacity,
        });
        return this.eventRepository.save(event);
    }

    async findAll(filterDto: FilterEventDto) {
        const { search, category, status, location, startDate, endDate, page, limit } = filterDto;

        // Utilisation de QueryBuilder pour les filtres complexes
        const query = this.eventRepository.createQueryBuilder('event');

        if (search) {
            query.andWhere(
                `(
                event.title LIKE :search OR
                event.description LIKE :search OR
                event.location LIKE :search OR
                event.organizerId LIKE :search OR
                event.category LIKE :search OR
                event.status LIKE :search
                )`,
                { search: `%${search}%` },
            );
        }
        if (category) {
            query.andWhere('event.category = :category', { category });
        }

        if (status) {
            query.andWhere('event.status = :status', { status });
        }

        if (location) {
            query.andWhere('event.location LIKE :location', { location: `%${location}%` });
        }

        if (startDate) {
            query.andWhere('event.startDate >= :startDate', { startDate });
        }

        if (endDate) {
            query.andWhere('event.endDate <= :endDate', { endDate });
        }

        // Pagination
        const pageNum = page || 1;
        const limitNum = limit || 10;

        query.skip((pageNum - 1) * limitNum).take(limitNum);
        query.orderBy('event.startDate', 'ASC');

        const [items, total] = await query.getManyAndCount();

        return {
            data: items,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        };
    }

    async findOne(id: string): Promise<Event> {
        const event = await this.eventRepository.findOne({ where: { id } });
        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }

    async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
        const event = await this.eventRepository.preload({
            id,
            ...updateEventDto,
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }

        return this.eventRepository.save(event);
    }

    async remove(id: string): Promise<void> {
        const result = await this.eventRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
    }
        
    async publish(id: string): Promise<Event> {
        const event = await this.findOne(id);
        event.status = EventStatus.PUBLISHED;
        return this.eventRepository.save(event);
    }

    async cancel(id: string): Promise<Event> {
        const event = await this.findOne(id);
        event.status = EventStatus.CANCELLED;
        return this.eventRepository.save(event);
    }

    async markCompleted(id: string): Promise<Event> {
        const event = await this.findOne(id);
        event.status = EventStatus.COMPLETED;
        event.availableSeats = 0;
        return this.eventRepository.save(event);
    }
}