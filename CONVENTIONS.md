# 📐 Conventions de Code

Ce document définit les conventions de code et bonnes pratiques pour le projet.

## 📁 Structure des Fichiers

### Organisation d'un Service

```
service-name/
├── src/
│   ├── entities/          # Entités TypeORM
│   │   └── *.entity.ts
│   ├── dto/              # Data Transfer Objects
│   │   ├── create-*.dto.ts
│   │   ├── update-*.dto.ts
│   │   └── filter-*.dto.ts
│   ├── controllers/      # Controllers REST
│   │   └── *.controller.ts
│   ├── services/         # Logique métier
│   │   └── *.service.ts
│   ├── repositories/     # Repositories (optionnel)
│   │   └── *.repository.ts
│   ├── events/           # Event handlers & publishers
│   │   ├── handlers/
│   │   └── publishers/
│   ├── guards/           # Guards d'authentification
│   │   └── *.guard.ts
│   ├── decorators/       # Decorators personnalisés
│   │   └── *.decorator.ts
│   ├── interfaces/       # Interfaces TypeScript
│   │   └── *.interface.ts
│   ├── config/           # Configuration
│   │   └── *.config.ts
│   ├── app.module.ts     # Module principal
│   └── main.ts           # Point d'entrée
├── test/                 # Tests E2E
│   └── *.e2e-spec.ts
└── package.json
```

## 🎨 Conventions de Nommage

### Fichiers

```
# Entités
user.entity.ts
event.entity.ts

# DTOs
create-user.dto.ts
update-event.dto.ts
filter-ticket.dto.ts

# Controllers
user.controller.ts
auth.controller.ts

# Services
user.service.ts
email.service.ts

# Modules
user.module.ts
database.module.ts

# Tests
user.service.spec.ts
user.controller.spec.ts
user.e2e-spec.ts
```

### Classes

```typescript
// PascalCase pour les classes
export class UserEntity { }
export class CreateUserDto { }
export class UserService { }
export class AuthController { }
export class JwtAuthGuard { }
```

### Interfaces

```typescript
// PascalCase avec préfixe I (optionnel)
export interface User { }
export interface IPaymentProvider { }
export interface EventPublisher { }
```

### Variables et Fonctions

```typescript
// camelCase
const userId = '123';
const isAuthenticated = true;

function getUserById(id: string) { }
async function createEvent(dto: CreateEventDto) { }
```

### Constants

```typescript
// UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 10;
const API_VERSION = 'v1';
```

### Enums

```typescript
// PascalCase pour l'enum, UPPER_CASE pour les valeurs
export enum UserRole {
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
  PARTICIPANT = 'PARTICIPANT',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
}
```

## 📝 TypeScript Best Practices

### Types Explicites

```typescript
// ✅ Bon
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// ❌ Éviter
function calculateTotal(price, quantity) {
  return price * quantity;
}
```

### Interfaces vs Types

```typescript
// ✅ Utiliser interface pour les objets
export interface User {
  id: string;
  email: string;
  name: string;
}

// ✅ Utiliser type pour les unions/intersections
export type EventStatus = 'draft' | 'published' | 'cancelled';
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
```

### Éviter `any`

```typescript
// ❌ Éviter
function processData(data: any) { }

// ✅ Bon
function processData(data: unknown) {
  if (typeof data === 'string') {
    // Process string
  }
}

// ✅ Mieux
function processData<T extends BaseData>(data: T) { }
```

## 🏗️ Architecture & Design Patterns

### Dependency Injection

```typescript
// ✅ Injecter les dépendances via le constructeur
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly eventPublisher: EventPublisher,
  ) {}
}

// ❌ Éviter l'instanciation directe
export class EventService {
  private eventRepository = new EventRepository(); // ❌
}
```

### Single Responsibility Principle

```typescript
// ✅ Un service = une responsabilité
@Injectable()
export class UserService {
  // Uniquement la logique liée aux users
  async create(dto: CreateUserDto) { }
  async findById(id: string) { }
}

@Injectable()
export class EmailService {
  // Uniquement l'envoi d'emails
  async sendWelcomeEmail(user: User) { }
}

// ❌ Éviter de tout mélanger
@Injectable()
export class UserService {
  async create(dto: CreateUserDto) { }
  async sendEmail(to: string) { } // ❌ Pas sa responsabilité
}
```

### Repository Pattern

```typescript
// ✅ Utiliser les repositories pour l'accès aux données
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }
}
```

## 🎯 DTOs et Validation

### Définition des DTOs

```typescript
import { IsString, IsEmail, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
```

### Réutilisation avec PartialType

```typescript
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Tous les champs de CreateUserDto deviennent optionnels
}
```

## 🚀 Controllers

### Structure d'un Controller

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll(@Query() filterDto: FilterEventDto) {
    return this.eventService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventService.findById(id);
  }

  @Post()
  async create(@Body() createDto: CreateEventDto) {
    return this.eventService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateEventDto,
  ) {
    return this.eventService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
```

### Gestion des Erreurs

```typescript
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class EventService {
  async findById(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    
    return event;
  }

  async create(dto: CreateEventDto): Promise<Event> {
    if (dto.startDate > dto.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    
    return this.eventRepository.save(dto);
  }
}
```

## 🔄 Event-Driven

### Publisher d'Événements

```typescript
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventType } from '../../../shared/events/event.events';

@Injectable()
export class EventPublisherService {
  constructor(private eventEmitter: EventEmitter2) {}

  publishEventCreated(event: Event) {
    this.eventEmitter.emit(EventType.EVENT_CREATED, {
      eventId: crypto.randomUUID(),
      eventType: EventType.EVENT_CREATED,
      timestamp: new Date(),
      aggregateId: event.id,
      version: 1,
      data: {
        eventId: event.id,
        title: event.title,
        organizerId: event.organizerId,
        // ... autres données
      },
    });
  }
}
```

### Consumer d'Événements

```typescript
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventType, EventCreatedEvent } from '../../../shared/events/event.events';

@Injectable()
export class EventConsumerService {
  @OnEvent(EventType.EVENT_CREATED)
  async handleEventCreated(event: EventCreatedEvent) {
    console.log('Event created:', event.data);
    
    // Logique métier
    // Par exemple: envoyer une notification
  }
}
```

## 🧪 Tests

### Tests Unitaires

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let repository: Repository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    repository = module.get(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const events = [{ id: '1', title: 'Test Event' }];
      jest.spyOn(repository, 'find').mockResolvedValue(events);

      expect(await service.findAll()).toBe(events);
    });
  });
});
```

### Tests E2E

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('EventController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/events (GET)', () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## 📦 Modules

### Organisation d'un Module

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { Event } from './entities/event.entity';
import { EventPublisherService } from './events/publishers/event-publisher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [EventController],
  providers: [EventService, EventPublisherService],
  exports: [EventService], // Exporter pour utilisation dans d'autres modules
})
export class EventModule {}
```

## 🔒 Sécurité

### Guards

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Utilisation

```typescript
import { UseGuards } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';

@Controller('events')
export class EventController {
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  async create(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }
}
```

## 💬 Commentaires

```typescript
// ✅ Bon - Explication du "pourquoi"
// Retry 3 times because external API is unstable
const MAX_RETRY = 3;

// ✅ Bon - Documentation JSDoc pour les APIs publiques
/**
 * Creates a new event
 * @param dto - Event creation data
 * @returns Created event with generated ID
 * @throws BadRequestException if dates are invalid
 */
async create(dto: CreateEventDto): Promise<Event> { }

// ❌ Éviter - Commentaire évident
// Increment counter
counter++;
```

## 📊 Logging

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  async create(dto: CreateEventDto): Promise<Event> {
    this.logger.log(`Creating event: ${dto.title}`);
    
    try {
      const event = await this.eventRepository.save(dto);
      this.logger.log(`Event created with ID: ${event.id}`);
      return event;
    } catch (error) {
      this.logger.error(`Failed to create event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

## ✨ Code Style

Utiliser Prettier et ESLint (déjà configurés dans le projet):

```powershell
# Formatter le code
npm run format

# Linter le code
npm run lint

# Fix automatique
npm run lint:fix
```

---

**Respectez ces conventions pour maintenir une base de code cohérente et maintenable !**
