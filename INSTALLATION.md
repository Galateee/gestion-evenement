# Installation Guide

## Installation Rapide (Windows PowerShell)

### 1. Copier les fichiers .env

```powershell
# Racine du projet
Copy-Item .env.example .env

# Services
Copy-Item services\api-gateway\.env.example services\api-gateway\.env
Copy-Item services\event-service\.env.example services\event-service\.env
Copy-Item services\ticket-service\.env.example services\ticket-service\.env
Copy-Item services\payment-service\.env.example services\payment-service\.env
Copy-Item services\notification-service\.env.example services\notification-service\.env
Copy-Item services\user-service\.env.example services\user-service\.env
```

### 2. Installer les dépendances de tous les services

```powershell
# API Gateway
cd services\api-gateway; npm install; cd ..\..

# Event Service
cd services\event-service; npm install; cd ..\..

# Ticket Service
cd services\ticket-service; npm install; cd ..\..

# Payment Service
cd services\payment-service; npm install; cd ..\..

# Notification Service
cd services\notification-service; npm install; cd ..\..

# User Service
cd services\user-service; npm install; cd ..\..
```

### 3. Démarrer avec Docker

```powershell
docker-compose up -d
```

### 4. Vérifier les services

```powershell
# Liste des containers
docker-compose ps

# Logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f event-service
```

## Commandes Utiles

### Développement Local (sans Docker)

1. Démarrer PostgreSQL et RabbitMQ :
```powershell
docker-compose up -d postgres-events postgres-tickets postgres-payments postgres-users rabbitmq
```

2. Démarrer un service en mode dev :
```powershell
cd services\event-service
npm run start:dev
```

### Rebuild des services

```powershell
# Rebuild tous les services
docker-compose up -d --build

# Rebuild un service spécifique
docker-compose up -d --build event-service
```

### Nettoyage

```powershell
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ Supprime les données)
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all
```

### Base de données

```powershell
# Se connecter à une base
docker exec -it postgres-events psql -U pguser -d event_db

# Dump d'une base
docker exec postgres-events pg_dump -U pguser event_db > backup.sql
```

## Troubleshooting

### Problème : Port déjà utilisé

```powershell
# Trouver le processus utilisant le port
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

### Problème : Docker ne démarre pas

```powershell
# Vérifier Docker
docker --version
docker-compose --version

# Restart Docker Desktop
```

### Problème : Dépendances npm

```powershell
# Nettoyer et réinstaller
cd services\event-service
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### Problème : RabbitMQ ne démarre pas

```powershell
# Voir les logs
docker-compose logs rabbitmq

# Restart RabbitMQ
docker-compose restart rabbitmq
```

## Configuration Avancée

### Variables d'environnement importantes

Modifier `.env` à la racine :

```env
# Database
POSTGRES_USER=pguser
POSTGRES_PASSWORD=pgpass

# RabbitMQ
RABBITMQ_USER=user
RABBITMQ_PASS=password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

### Stripe (Payment Service)

Dans `services/payment-service/.env` :

```env
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### SMTP (Notification Service)

Dans `services/notification-service/.env` :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## URLs de Développement

- API Gateway: http://localhost:3000
- Event Service: http://localhost:3001
- Ticket Service: http://localhost:3002
- Payment Service: http://localhost:3003
- Notification Service: http://localhost:3004
- User Service: http://localhost:3005
- RabbitMQ Management: http://localhost:15672

## Next Steps

1. ✅ Installation terminée
2. 🔧 Configurer les variables d'environnement
3. 📝 Implémenter les endpoints REST
4. 🎯 Implémenter les event handlers
5. 🧪 Écrire les tests
6. 📚 Compléter la documentation
