# 🎫 Plateforme de Gestion d'Événements en Ligne

Projet de fin de module - Architecture Logicielle (Année 2025-2026)

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 🚀 Quick Start

```powershell
# Installation automatique
.\setup.ps1

# Démarrer tous les services
docker-compose up -d

# Vérifier l'état
docker-compose ps
```

**C'est tout !** 🎉 Votre plateforme est maintenant opérationnelle.

> ℹ️ Pensez à renseigner `SMTP_USER` et `SMTP_PASSWORD` dans vos `.env` si vous voulez tester l'envoi d'emails ; sinon les services démarrent mais les logs afficheront un avertissement.

👉 **Nouveau ?** Consultez le [Guide de Démarrage Rapide](./QUICKSTART.md)

---

## 📋 Description

Plateforme complète de gestion d'événements basée sur une **architecture microservices** et **event-driven** permettant aux organisateurs de créer et gérer des événements, et aux participants de découvrir, réserver et assister à ces événements.

## 🏗️ Architecture

### Architecture Microservices

Le système est décomposé en 6 microservices indépendants :

1. **API Gateway** (Port 3000) - Point d'entrée unique, routage, authentification
2. **User Service** (Port 3005) - Authentification, gestion des utilisateurs et rôles
3. **Event Service** (Port 3001) - Gestion du catalogue d'événements
4. **Ticket Service** (Port 3002) - Réservations, génération de billets, QR codes
5. **Payment Service** (Port 3003) - Traitement des paiements, remboursements
6. **Notification Service** (Port 3004) - Envoi d'emails, notifications

### Architecture Event-Driven

Communication asynchrone via **RabbitMQ** entre les microservices :

- `EventCreated` → Notifications
- `EventUpdated` → Billetterie + Notifications
- `EventCancelled` → Billetterie + Paiement + Notifications
- `TicketBooked` → Paiement
- `PaymentProcessed` → Billetterie + Notifications
- `PaymentFailed` → Billetterie + Notifications
- `TicketCancelled` → Paiement (remboursement)

### Stack Technique

- **Backend**: Node.js / NestJS
- **Bases de données**: PostgreSQL (une par service)
- **Message Broker**: RabbitMQ
- **Containerisation**: Docker & Docker Compose
- **ORM**: TypeORM
- **Validation**: class-validator

## 📁 Structure du Projet

```
gestion-evenement/
├── shared/                      # Types, événements et interfaces partagés
│   ├── events/                  # Événements métier (Event-Driven)
│   ├── enums/                   # Enums partagés
│   └── interfaces/              # Interfaces communes
│
├── services/
│   ├── api-gateway/             # API Gateway
│   ├── user-service/            # Service Utilisateurs
│   ├── event-service/           # Service Événements
│   ├── ticket-service/          # Service Billetterie
│   ├── payment-service/         # Service Paiement
│   └── notification-service/    # Service Notifications
│
├── docker-compose.yml           # Orchestration des services
├── .env.example                 # Variables d'environnement
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis

- **Node.js** >= 20.x
- **Docker** & **Docker Compose**
- **npm** ou **yarn**

### 1. Cloner le projet

```bash
git clone https://github.com/Galateee/gestion-evenement.git
cd gestion-evenement
```

### 2. Configuration des variables d'environnement

Créer un fichier `.env` à la racine :

```bash
cp .env.example .env
```

Créer des fichiers `.env` pour chaque service :

```bash
# Pour chaque service
cd services/event-service && cp .env.example .env
cd ../ticket-service && cp .env.example .env
cd ../payment-service && cp .env.example .env
cd ../notification-service && cp .env.example .env
cd ../user-service && cp .env.example .env
cd ../api-gateway && cp .env.example .env
```

### 3. Installation des dépendances

```bash
# Pour chaque service
cd services/api-gateway && npm install
cd ../event-service && npm install
cd ../ticket-service && npm install
cd ../payment-service && npm install
cd ../notification-service && npm install
cd ../user-service && npm install
```

### 4. Démarrage avec Docker Compose

```bash
# À la racine du projet
docker-compose up -d
```

Cette commande démarre :
- 4 bases de données PostgreSQL (events, tickets, payments, users)
- RabbitMQ avec interface de gestion
- Les 6 microservices

### 5. Vérification

- **API Gateway**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672 (user/password)
- **Event Service**: http://localhost:3001
- **Ticket Service**: http://localhost:3002
- **Payment Service**: http://localhost:3003
- **Notification Service**: http://localhost:3004
- **User Service**: http://localhost:3005

## 🔧 Développement Local

### Démarrer un service individuellement

```bash
cd services/event-service
npm run start:dev
```

### Rebuild un service Docker

```bash
docker-compose up -d --build event-service
```

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f event-service
```

### Arrêter les services

```bash
docker-compose down

# Avec suppression des volumes
docker-compose down -v
```

## 📊 Bases de Données

Chaque service possède sa propre base de données PostgreSQL :

| Service | Base de données | Port |
|---------|----------------|------|
| Event Service | event_db | 5433 |
| Ticket Service | ticket_db | 5434 |
| Payment Service | payment_db | 5435 |
| User Service | user_db | 5436 |

Connexion locale :
```bash
psql -h localhost -p 5433 -U pguser -d event_db
```

> Les healthchecks Postgres ciblent désormais explicitement chaque base (`event_db`, `ticket_db`, `payment_db`, `user_db`) pour éviter les messages "database pguser does not exist" au démarrage.

## 🎯 Fonctionnalités Principales

### Gestion des Événements
- ✅ Création et publication d'événements
- ✅ Catégorisation (conférence, concert, formation, sport, etc.)
- ✅ Recherche et filtrage avancés
- ✅ Modification et annulation

### Système de Billetterie
- ✅ Réservation en temps réel
- ✅ Types de billets (VIP, Standard, Gratuit, Early Bird)
- ✅ Génération de QR codes
- ✅ Gestion de la capacité

### Module de Paiement
- ✅ Traitement sécurisé (Stripe)
- ✅ Remboursements automatiques
- ✅ Historique des transactions

### Système de Notifications
- ✅ Emails automatiques (confirmation, rappel, annulation)
- ✅ Notifications asynchrones via RabbitMQ

### Gestion des Utilisateurs
- ✅ Authentification JWT
- ✅ Rôles (Participant, Organisateur, Admin)
- ✅ Profils utilisateurs

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📖 QUICKSTART.md](./QUICKSTART.md) | Guide de démarrage en 5 minutes |
| [🏗️ ARCHITECTURE.md](./ARCHITECTURE.md) | Architecture détaillée du système |
| [📋 INSTALLATION.md](./INSTALLATION.md) | Guide d'installation complet |
| [🛠️ COMMANDS.md](./COMMANDS.md) | Toutes les commandes utiles |
| [✅ TODO.md](./TODO.md) | État d'avancement et tâches |
| [📐 CONVENTIONS.md](./CONVENTIONS.md) | Conventions de code et bonnes pratiques |

---

## 🛠️ Technologies Utilisées

| Catégorie | Technologies |
|-----------|-------------|
| Backend | NestJS, Node.js, TypeScript |
| Bases de données | PostgreSQL, TypeORM |
| Message Broker | RabbitMQ |
| Validation | class-validator, class-transformer |
| Authentification | JWT, Passport |
| Paiement | Stripe |
| Email | Nodemailer |
| DevOps | Docker, Docker Compose |

## 👥 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

**Projet YNOV - Architecture Logicielle 2025-2026**

---

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.
