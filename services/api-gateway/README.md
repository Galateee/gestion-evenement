# 🌐 API Gateway - Plateforme de Gestion d'Événements

Ce microservice constitue le **point d'entrée unique** (Single Entry Point) de l'architecture microservices du projet[cite: 54]. Il redirige les requêtes HTTP vers les services backend appropriés et centralise l'accès pour les clients (Web/Mobile).

## 📋 Fonctionnalités

  * **Routage dynamique (Proxy) :** Redirection transparente des requêtes vers 5 microservices distincts via `http-proxy-middleware`.
  * **Documentation Centrale :** Page d'accueil HTML listant les services disponibles (Route `/`).
  * **Configuration Centralisée :** Gestion des URLs des services via variables d'environnement.

## 🛠️ Stack Technique

  * **Framework :** [NestJS](https://nestjs.com/)
  * **Proxy :** `http-proxy-middleware`
  * **Langage :** TypeScript

## 🚀 Installation

1.  **Cloner le dépôt et accéder au dossier :**

    ```bash
    cd api-gateway
    ```

2.  **Installer les dépendances :**

    ```bash
    npm install
    ```

## ⚙️ Configuration

Créez un fichier `.env` à la racine du projet et configurez les URLs de vos microservices locaux :

```env
NODE_ENV=development
PORT=3000

# URLs des Microservices
EVENT_SERVICE_URL=http://localhost:3001
TICKET_SERVICE_URL=http://localhost:3002
PAYMENT_SERVICE_URL=http://localhost:3003
NOTIFICATION_SERVICE_URL=http://localhost:3004
USER_SERVICE_URL=http://localhost:3005

# Sécurité
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
```

## ▶️ Démarrage

**Mode développement (avec hot-reload) :**

```bash
npm run start:dev
```

Le serveur démarrera sur **[http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)**.

## 🔀 Mappage des Routes

Le Gateway redirige les préfixes d'URL suivants vers les microservices correspondants :

| Préfixe Route (Gateway) | Microservice Cible | Description |
| :--- | :--- | :--- |
| `/events/*` | **Event Service** | [cite_start]Gestion du catalogue et recherche [cite: 52] |
| `/tickets/*` | **Ticket Service** | [cite_start]Réservations et stock [cite: 53] |
| `/payments/*` | **Payment Service** | [cite_start]Transactions et remboursements [cite: 53] |
| `/users/*` | **User Service** | [cite_start]Profils utilisateurs [cite: 53] |
| `/auth/*` | **User Service** | Authentification (Login/Register) |
| `/notifications/*` | **Notification Service** | [cite_start]Emails et alertes [cite: 53] |

### Exemple de flux

1.  Le client envoie : `GET http://localhost:3000/events`
2.  L'API Gateway transmet à : `GET http://localhost:3001/events`
3.  La réponse est renvoyée au client comme si elle venait du Gateway.

## 📚 Documentation API

Une fois le serveur lancé, visitez la racine pour une vue d'ensemble :
👉 **[http://localhost:3000/](https://www.google.com/search?q=http://localhost:3000/)**

## 🏗️ Architecture

Ce projet s'inscrit dans le cadre du module "Architecture Logicielle". Il respecte le pattern **Microservices** où chaque service est autonome et possède sa propre base de données.

-----

*Année Universitaire 2025-2026*

-----