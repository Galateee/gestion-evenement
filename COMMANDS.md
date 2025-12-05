# 🛠️ Commandes Utiles

Ce fichier contient toutes les commandes utiles pour développer sur le projet.

## 📦 Installation

```powershell
# Installation automatique
.\setup.ps1

# OU installation manuelle
# Copier les fichiers .env
Copy-Item .env.example .env

# Installer les dépendances de tous les services
cd services\api-gateway; npm install; cd ..\..
cd services\event-service; npm install; cd ..\..
cd services\ticket-service; npm install; cd ..\..
cd services\payment-service; npm install; cd ..\..
cd services\notification-service; npm install; cd ..\..
cd services\user-service; npm install; cd ..\..
```

## 🐳 Docker Commands

### Démarrage

```powershell
# Démarrer tous les services
docker-compose up -d

# Démarrer un service spécifique
docker-compose up -d event-service

# Démarrer avec rebuild
docker-compose up -d --build

# Démarrer et voir les logs
docker-compose up
```

### Logs

```powershell
# Tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f event-service

# Logs des 100 dernières lignes
docker-compose logs --tail=100 -f
```

### Status

```powershell
# Voir l'état des services
docker-compose ps

# Voir les stats (CPU, RAM)
docker stats

# Inspecter un service
docker inspect event-service
```

### Arrêt

```powershell
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ Supprime les données)
docker-compose down -v

# Arrêter et supprimer images
docker-compose down --rmi all
```

### Rebuild

```powershell
# Rebuild tous les services
docker-compose build

# Rebuild un service spécifique
docker-compose build event-service

# Rebuild sans cache
docker-compose build --no-cache
```

### Scale

```powershell
# Lancer 3 instances du ticket-service
docker-compose up -d --scale ticket-service=3

# Vérifier
docker-compose ps
```

## 💻 Développement Local

### Démarrer un service en mode dev (hors Docker)

```powershell
# 1. Démarrer l'infrastructure uniquement
docker-compose up -d postgres-events postgres-tickets postgres-payments postgres-users rabbitmq

# 2. Démarrer un service en mode dev
cd services\event-service
npm run start:dev
```

### Build local

```powershell
cd services\event-service
npm run build
```

### Démarrer en mode production local

```powershell
cd services\event-service
npm run start:prod
```

## 🗄️ Base de Données

### Connexion aux bases

```powershell
# Event DB
docker exec -it postgres-events psql -U pguser -d event_db

# Ticket DB
docker exec -it postgres-tickets psql -U pguser -d ticket_db

# Payment DB
docker exec -it postgres-payments psql -U pguser -d payment_db

# User DB
docker exec -it postgres-users psql -U pguser -d user_db
```

### Commandes PostgreSQL utiles

```sql
-- Lister les tables
\dt

-- Voir la structure d'une table
\d events

-- Compter les enregistrements
SELECT COUNT(*) FROM events;

-- Supprimer toutes les données
TRUNCATE TABLE events CASCADE;

-- Quitter
\q
```

### Dump et Restore

```powershell
# Dump d'une base
docker exec postgres-events pg_dump -U pguser event_db > backup_events.sql

# Restore
docker exec -i postgres-events psql -U pguser event_db < backup_events.sql
```

### Migrations TypeORM

```powershell
cd services\event-service

# Générer une migration
npm run typeorm migration:generate -- -n CreateEventTable

# Exécuter les migrations
npm run typeorm migration:run

# Rollback
npm run typeorm migration:revert
```

## 🐰 RabbitMQ

### Interface Web

Ouvrir: http://localhost:15672
- Username: `user`
- Password: `password`

### CLI dans le container

```powershell
# Entrer dans le container
docker exec -it rabbitmq bash

# Lister les queues
rabbitmqctl list_queues

# Lister les exchanges
rabbitmqctl list_exchanges

# Purger une queue
rabbitmqctl purge_queue event-service.queue

# Voir les connexions
rabbitmqctl list_connections
```

## 🧪 Tests

```powershell
cd services\event-service

# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec coverage
npm run test:cov

# Tests e2e
npm run test:e2e
```

## 🔍 Debugging

### Voir les logs d'un container

```powershell
docker logs -f event-service
```

### Entrer dans un container

```powershell
docker exec -it event-service sh
```

### Inspecter le réseau Docker

```powershell
# Lister les réseaux
docker network ls

# Inspecter le réseau du projet
docker network inspect gestion-evenement_event-network
```

### Vérifier les ports utilisés

```powershell
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5672

# Voir tous les ports écoutés
netstat -ano | findstr LISTENING
```

## 🧹 Nettoyage

### Nettoyage Docker

```powershell
# Supprimer tous les containers arrêtés
docker container prune

# Supprimer toutes les images non utilisées
docker image prune

# Supprimer tous les volumes non utilisés
docker volume prune

# Nettoyage complet (⚠️ Danger)
docker system prune -a --volumes
```

### Nettoyage Node

```powershell
# Supprimer node_modules de tous les services
Get-ChildItem -Path services -Recurse -Directory -Filter node_modules | Remove-Item -Recurse -Force

# Supprimer dist de tous les services
Get-ChildItem -Path services -Recurse -Directory -Filter dist | Remove-Item -Recurse -Force

# Supprimer package-lock.json
Get-ChildItem -Path services -Recurse -File -Filter package-lock.json | Remove-Item -Force
```

## 📊 Monitoring

### Voir l'utilisation des ressources

```powershell
# Stats en temps réel
docker stats

# Stats formatées
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

## 🔑 Variables d'Environnement

### Afficher les variables d'un service

```powershell
docker-compose config
```

### Modifier les variables

Éditer le fichier `.env` à la racine ou les fichiers `.env` dans chaque service.

## 🚀 Production

### Build pour production

```powershell
# Build tous les services
docker-compose -f docker-compose.prod.yml build

# Démarrer en production
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Logs & Debug

### Augmenter le niveau de log

Dans le fichier `.env` de chaque service:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

### Exporter les logs

```powershell
docker-compose logs > logs_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').txt
```

## 🔄 Restart Services

```powershell
# Restart tous les services
docker-compose restart

# Restart un service spécifique
docker-compose restart event-service
```

## 📦 NPM Scripts (dans chaque service)

```powershell
# Development
npm run start:dev

# Production
npm run start:prod

# Build
npm run build

# Tests
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e

# Linting
npm run lint
npm run lint:fix

# Format
npm run format
```

## 🆘 Troubleshooting

### Port déjà utilisé

```powershell
# Trouver le processus
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

### Problème de permissions Docker

```powershell
# Relancer Docker Desktop en administrateur
```

### Base de données corrompue

```powershell
# Supprimer les volumes et recréer
docker-compose down -v
docker-compose up -d
```

### RabbitMQ ne démarre pas

```powershell
# Supprimer le volume RabbitMQ
docker volume rm gestion-evenement_rabbitmq_data

# Redémarrer
docker-compose up -d rabbitmq
```
