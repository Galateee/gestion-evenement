import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { FilterEventDto } from '../dto/filter-event.dto';
import { EventStatus, UserRole } from '../../../../shared/enums';
import { canTransition } from '../entities/event-status';

interface CurrentUser {
  id: string;
  role: UserRole;
}

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    currentUser: CurrentUser,
  ): Promise<Event> {
    const event = this.eventRepository.create({
      ...createEventDto,
      organizerId: currentUser.id,
      availableSeats: createEventDto.capacity,
    });
    return this.eventRepository.save(event);
  }

  async findAll(filterDto: FilterEventDto) {
    const {
      search,
      category,
      status,
      location,
      startDate,
      endDate,
      page,
      limit,
    } = filterDto;

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
      query.andWhere('event.location LIKE :location', {
        location: `%${location}%`,
      });
    }

    if (startDate) {
      query.andWhere('event.startDate >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('event.endDate <= :endDate', { endDate });
    }
    const pageNum = page || 1;
    const limitNum = limit || 10;

    query.skip((pageNum - 1) * limitNum).take(limitNum);
    query.orderBy('event.startDate', 'ASC');

    // this.checkOwnerOrAdmin(event, currentUser);

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

  private checkOwnerOrAdmin(event: Event, user: CurrentUser) {
    const isAdmin = user.role === UserRole.ADMIN;
    const isOwner = event.organizerId === user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres événements.',
      );
    }
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    currentUser: CurrentUser,
  ): Promise<Event> {
    const event = await this.findOne(id);

    // this.checkOwnerOrAdmin(event, currentUser);

    Object.assign(event, updateEventDto);

    return this.eventRepository.save(event);
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    const event = await this.findOne(id);

    // this.checkOwnerOrAdmin(event, currentUser);

    await this.eventRepository.delete(id);
  }

  async publish(id: string, currentUser: CurrentUser): Promise<Event> {
    const event = await this.findOne(id);

    this.checkOwnerOrAdmin(event, currentUser);

    if (!canTransition(event.status, EventStatus.PUBLISHED)) {
      throw new BadRequestException(
        `Cannot publish event: invalid transition from ${event.status} to PUBLISHED`,
      );
    }

    event.status = EventStatus.PUBLISHED;
    return this.eventRepository.save(event);
  }

  async cancel(id: string, currentUser: CurrentUser): Promise<Event> {
    const event = await this.findOne(id);

    // this.checkOwnerOrAdmin(event, currentUser);

    this.checkOwnerOrAdmin(event, currentUser);

    if (!canTransition(event.status, EventStatus.CANCELLED)) {
      throw new BadRequestException(
        `Cannot cancel event: invalid transition from ${event.status} to CANCELLED`,
      );
    }

    event.status = EventStatus.CANCELLED;
    return this.eventRepository.save(event);
  }

  async markCompleted(id: string, currentUser: CurrentUser): Promise<Event> {
    const event = await this.findOne(id);

    // this.checkOwnerOrAdmin(event, currentUser);

    this.checkOwnerOrAdmin(event, currentUser);

    if (!canTransition(event.status, EventStatus.COMPLETED)) {
      throw new BadRequestException(
        `Cannot complete event: invalid transition from ${event.status} to COMPLETED`,
      );
    }

    event.status = EventStatus.COMPLETED;
    event.availableSeats = 0;
    return this.eventRepository.save(event);
  }
  async findUpcoming(): Promise<Event[]> {
    const now = new Date();

    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.startDate > :now', { now })
      .orderBy('event.startDate', 'ASC')
      .getMany();
  }
}
