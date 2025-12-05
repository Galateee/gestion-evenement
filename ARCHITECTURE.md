# 🏗️ Architecture du Système

## Vue d'Ensemble

```
                                    ┌─────────────────┐
                                    │   Client Web    │
                                    │   / Mobile      │
                                    └────────┬────────┘
                                             │
                                             │ HTTP/REST
                                             │
                                    ┌────────▼────────┐
                                    │  API Gateway    │
                                    │    :3000        │
                                    │   Auth/Routing  │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
         ┌──────────▼──────────┐  ┌─────────▼─────────┐  ┌──────────▼──────────┐
         │   User Service      │  │  Event Service    │  │  Ticket Service     │
         │      :3005          │  │      :3001        │  │      :3002          │
         │   JWT/Auth          │  │   CRUD Events     │  │  Reservations       │
         └──────────┬──────────┘  └─────────┬─────────┘  └──────────┬──────────┘
                    │                       │                        │
                    │              ┌────────▼────────┐               │
                    │              │ Payment Service │               │
                    │              │      :3003      │               │
                    │              │  Stripe/Refunds │               │
                    │              └────────┬────────┘               │
                    │                       │                        │
                    └───────────────────────┼────────────────────────┘
                                            │
                                   ┌────────▼────────┐
                                   │   RabbitMQ      │
                                   │  Message Broker │
                                   └────────┬────────┘
                                            │
                                   ┌────────▼────────┐
                                   │ Notification    │
                                   │    Service      │
                                   │     :3004       │
                                   │  Email/Push     │
                                   └─────────────────┘

         ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
         │ user_db  │  │ event_db │  │ ticket_db│  │payment_db│
         │  :5436   │  │  :5433   │  │  :5434   │  │  :5435   │
         └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

## 🎯 Responsabilités des Services

### API Gateway (Port 3000)
- ✅ Point d'entrée unique
- ✅ Authentification JWT
- ✅ Routage vers les microservices
- ✅ Validation des requêtes
- ✅ Rate limiting

**Technologies**: NestJS, Passport JWT, Axios

### User Service (Port 3005)
- ✅ Inscription / Connexion
- ✅ Gestion des profils
- ✅ Rôles (Participant, Organisateur, Admin)
- ✅ Génération de tokens JWT

**Technologies**: NestJS, TypeORM, PostgreSQL, Bcrypt, JWT

### Event Service (Port 3001)
- ✅ CRUD événements
- ✅ Recherche et filtrage
- ✅ Catégorisation
- ✅ Publication d'événements métier

**Technologies**: NestJS, TypeORM, PostgreSQL, RabbitMQ

**Événements publiés**:
- `EventCreated`
- `EventUpdated`
- `EventCancelled`

### Ticket Service (Port 3002)
- ✅ Réservation de billets
- ✅ Types de billets (VIP, Standard, etc.)
- ✅ Génération QR codes
- ✅ Gestion de la capacité

**Technologies**: NestJS, TypeORM, PostgreSQL, RabbitMQ, QRCode

**Événements publiés**:
- `TicketBooked`
- `TicketCancelled`

**Événements consommés**:
- `EventCreated`
- `EventCancelled`
- `PaymentProcessed`
- `PaymentFailed`

### Payment Service (Port 3003)
- ✅ Traitement des paiements
- ✅ Intégration Stripe
- ✅ Remboursements automatiques
- ✅ Historique des transactions

**Technologies**: NestJS, TypeORM, PostgreSQL, RabbitMQ, Stripe

**Événements publiés**:
- `PaymentProcessed`
- `PaymentFailed`
- `PaymentRefunded`

**Événements consommés**:
- `TicketBooked`
- `TicketCancelled`

### Notification Service (Port 3004)
- ✅ Envoi d'emails
- ✅ Notifications push
- ✅ Templates personnalisés
- ✅ Rappels automatiques

**Technologies**: NestJS, RabbitMQ, Nodemailer

**Événements consommés**:
- `EventCreated`
- `EventCancelled`
- `TicketBooked`
- `PaymentProcessed`
- `PaymentFailed`

## 📨 Flux des Événements Métier

### 1. Création d'Événement
```
Organisateur → API Gateway → Event Service
                                   │
                                   ├─ Save to DB
                                   │
                                   └─ Publish EventCreated
                                             │
                                             └→ RabbitMQ → Notification Service
                                                              │
                                                              └─ Email confirmation
```

### 2. Réservation de Billet
```
Participant → API Gateway → Ticket Service
                                  │
                                  ├─ Check capacity
                                  ├─ Reserve ticket
                                  ├─ Save to DB
                                  │
                                  └─ Publish TicketBooked
                                            │
                                            └→ RabbitMQ → Payment Service
                                                             │
                                                             ├─ Process payment (Stripe)
                                                             │
                                                             └─ Publish PaymentProcessed
                                                                        │
                                                                        ├→ Ticket Service (validate)
                                                                        └→ Notification Service (email)
```

### 3. Annulation d'Événement
```
Organisateur → API Gateway → Event Service
                                   │
                                   ├─ Update status
                                   │
                                   └─ Publish EventCancelled
                                             │
                                             ├→ Ticket Service (cancel all tickets)
                                             │         │
                                             │         └─ Publish TicketCancelled
                                             │                    │
                                             │                    └→ Payment Service (refunds)
                                             │
                                             └→ Notification Service (email participants)
```

## 🗄️ Bases de Données

Chaque service possède sa propre base PostgreSQL (Database per Service pattern):

| Service | Database | Port | Tables Principales |
|---------|----------|------|-------------------|
| User | user_db | 5436 | users, profiles |
| Event | event_db | 5433 | events |
| Ticket | ticket_db | 5434 | tickets |
| Payment | payment_db | 5435 | payments, transactions |

## 🔐 Authentification & Autorisation

```
Client → API Gateway
            │
            ├─ Extract JWT token
            │
            ├─ Verify signature (JWT_SECRET)
            │
            ├─ Check expiration
            │
            └─ Forward user info to services
```

**Rôles**:
- `PARTICIPANT`: Réserver des billets, voir ses réservations
- `ORGANIZER`: Créer/modifier/annuler des événements
- `ADMIN`: Accès complet

## 🐰 RabbitMQ - Message Broker

**Configuration**:
- Host: localhost:5672
- Management UI: localhost:15672
- User: user / password

**Exchanges**:
- `events.exchange` (topic)

**Queues**:
- `event-service.queue`
- `ticket-service.queue`
- `payment-service.queue`
- `notification-service.queue`

**Routing Keys**:
- `event.created`
- `event.updated`
- `event.cancelled`
- `ticket.booked`
- `ticket.cancelled`
- `payment.processed`
- `payment.failed`
- `payment.refunded`

## 🔄 Patterns Architecturaux

### 1. Database per Service
Chaque microservice a sa propre base de données pour garantir l'indépendance.

### 2. API Gateway Pattern
Point d'entrée unique pour tous les clients.

### 3. Event-Driven Architecture
Communication asynchrone via événements pour découplage.

### 4. Saga Pattern (pour les transactions distribuées)
Exemple: Réservation de billet = Saga (Ticket → Payment → Notification)

### 5. CQRS (optionnel)
Séparation lecture/écriture pour optimisation.

## 🚀 Scalabilité

Chaque service peut être scalé indépendamment:

```bash
# Scaler le Ticket Service (3 instances)
docker-compose up -d --scale ticket-service=3

# Load balancing automatique avec Docker
```

## 📊 Monitoring (Bonus)

```
Services → Prometheus (metrics)
              │
              └→ Grafana (dashboards)

Services → Elasticsearch (logs)
              │
              ├→ Logstash (processing)
              │
              └→ Kibana (visualization)
```

## 🔒 Sécurité

- ✅ JWT pour l'authentification
- ✅ Bcrypt pour les mots de passe
- ✅ Variables d'environnement pour secrets
- ✅ HTTPS en production (TLS/SSL)
- ✅ Rate limiting (API Gateway)
- ✅ Validation des inputs (class-validator)

## 🧪 Tests

```
Unit Tests → Service Layer
Integration Tests → API Endpoints + Database
E2E Tests → Full workflows (booking flow, etc.)
```
