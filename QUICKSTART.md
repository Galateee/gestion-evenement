# 🚀 Quick Start Guide

Guide de démarrage rapide en 5 minutes !

## ⚡ Installation Express (5 minutes)

### Option 1: Script Automatique (Recommandé)

```powershell
# 1. Exécuter le script d'installation
.\setup.ps1

# 2. Démarrer les services
docker-compose up -d

# 3. Vérifier que tout fonctionne
docker-compose ps
```

### Option 2: Installation Manuelle

```powershell
# 1. Copier les variables d'environnement
Copy-Item .env.example .env

# 2. Installer les dépendances (un seul service pour commencer)
cd services\event-service
npm install
cd ..\..

# 3. Démarrer l'infrastructure
docker-compose up -d postgres-events rabbitmq

# 4. Démarrer le service en mode dev
cd services\event-service
npm run start:dev
```

## 🎯 Premiers Pas

### 1. Vérifier RabbitMQ

Ouvrir http://localhost:15672
- Username: `user`
- Password: `password`

✅ Vous devriez voir l'interface de gestion RabbitMQ

### 2. Vérifier PostgreSQL

```powershell
docker exec -it postgres-events psql -U pguser -d event_db
```

Dans psql:
```sql
\l              -- Lister les bases de données
\q              -- Quitter
```

✅ La base `event_db` doit être listée

### 3. Tester l'API Gateway

```powershell
# Démarrer l'API Gateway
cd services\api-gateway
npm install
npm run start:dev
```

Ouvrir http://localhost:3000

✅ Vous devriez voir une réponse (même si c'est une erreur 404, c'est normal)

## 📝 Développement Typique

### Workflow quotidien

```powershell
# 1. Démarrer l'infrastructure (une seule fois par session)
docker-compose up -d postgres-events postgres-tickets postgres-payments postgres-users rabbitmq

# 2. Démarrer le service sur lequel vous travaillez
cd services\event-service
npm run start:dev

# 3. Dans un autre terminal, démarrer l'API Gateway
cd services\api-gateway
npm run start:dev

# 4. Tester avec curl ou Postman
curl http://localhost:3000/events
```

### Arrêter proprement

```powershell
# Ctrl+C dans les terminaux des services

# Arrêter l'infrastructure
docker-compose down
```

## 🧪 Tester la Communication Event-Driven

### 1. Publier un événement manuellement

Créer un fichier `test-event.js` :

```javascript
const amqp = require('amqplib');

async function publishEvent() {
  const connection = await amqp.connect('amqp://user:password@localhost:5672');
  const channel = await connection.createChannel();
  
  const exchange = 'events.exchange';
  const routingKey = 'event.created';
  
  await channel.assertExchange(exchange, 'topic', { durable: true });
  
  const event = {
    eventId: '123',
    eventType: 'EVENT_CREATED',
    timestamp: new Date(),
    data: {
      title: 'Test Event',
      description: 'Event de test'
    }
  };
  
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(event)));
  console.log('✅ Event published:', event);
  
  setTimeout(() => {
    connection.close();
  }, 500);
}

publishEvent();
```

Exécuter:
```powershell
node test-event.js
```

### 2. Vérifier dans RabbitMQ

Aller sur http://localhost:15672 → Queues → Voir le message

## 📊 Structure Recommandée pour Commencer

Implémenter les services dans cet ordre:

### Semaine 1: Fondations

```
1. User Service (JWT + Auth)
   ├── Entités User
   ├── AuthController
   ├── JWT Strategy
   └── Tests

2. API Gateway
   ├── Proxy vers User Service
   ├── Auth Guard
   └── Tests
```

### Semaine 2: Core Business

```
3. Event Service
   ├── Entités Event
   ├── CRUD Controllers
   ├── Event Publishers (RabbitMQ)
   └── Tests

4. Tester le flux complet:
   Login → Create Event → Event publié dans RabbitMQ
```

### Semaine 3: Transactions

```
5. Ticket Service
   ├── Entités Ticket
   ├── BookingController
   ├── Event Consumers
   └── Tests

6. Payment Service
   ├── Entités Payment
   ├── Stripe Integration
   ├── Event Consumers
   └── Tests
```

### Semaine 4: Notifications & Polish

```
7. Notification Service
   ├── Email Templates
   ├── Event Consumers
   └── Tests

8. Tests E2E complets
9. Documentation
10. Diagrammes UML
```

## 🎓 Exemples de Code

### Créer un Controller (Event Service)

```typescript
// src/controllers/event.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll() {
    return this.eventService.findAll();
  }

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }
}
```

### Publier un Événement RabbitMQ

```typescript
// src/services/event.service.ts
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventService {
  constructor(
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateEventDto) {
    // 1. Sauvegarder en DB
    const event = await this.eventRepository.save(dto);
    
    // 2. Publier l'événement
    this.eventEmitter.emit('event.created', {
      eventId: event.id,
      eventType: 'EVENT_CREATED',
      timestamp: new Date(),
      data: event,
    });
    
    return event;
  }
}
```

## 📚 Ressources Utiles

### Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture détaillée
- [INSTALLATION.md](./INSTALLATION.md) - Guide d'installation complet
- [COMMANDS.md](./COMMANDS.md) - Toutes les commandes utiles
- [TODO.md](./TODO.md) - Liste des tâches

### Documentation Externe

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [Docker Compose](https://docs.docker.com/compose/)

## 🆘 Aide Rapide

### Problème: "Port already in use"

```powershell
# Trouver et tuer le processus
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problème: "Cannot connect to database"

```powershell
# Vérifier que PostgreSQL est démarré
docker-compose ps

# Voir les logs
docker-compose logs postgres-events

# Redémarrer
docker-compose restart postgres-events
```

### Problème: "RabbitMQ connection failed"

```powershell
# Vérifier RabbitMQ
docker-compose ps rabbitmq

# Voir les logs
docker-compose logs rabbitmq

# Accéder à l'interface
# http://localhost:15672 (user/password)
```

### Problème: "Module not found"

```powershell
# Réinstaller les dépendances
cd services\<service-name>
Remove-Item node_modules -Recurse -Force
npm install
```

## ✅ Checklist Avant de Commencer

- [ ] Docker Desktop installé et démarré
- [ ] Node.js >= 20 installé
- [ ] Git installé
- [ ] Un éditeur de code (VS Code recommandé)
- [ ] Postman ou un client HTTP pour tester les APIs
- [ ] Variables d'environnement configurées (.env)

## 🎉 Prêt à Coder !

Vous êtes maintenant prêt à commencer le développement !

**Prochaines étapes:**

1. Lire [ARCHITECTURE.md](./ARCHITECTURE.md) pour comprendre le système
2. Consulter [TODO.md](./TODO.md) pour voir ce qui reste à faire
3. Commencer par implémenter le User Service
4. Tester avec l'API Gateway
5. Ajouter les autres services progressivement

**Bon courage ! 🚀**
