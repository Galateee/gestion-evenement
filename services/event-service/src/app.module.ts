import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { Event } from './entities/event.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    // 1. Gestion des variables d'environnement (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Connexion Base de Données
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER ?? 'pguser',
      password: process.env.DATABASE_PASSWORD ?? 'pgpass',
      database: process.env.DATABASE_NAME ?? 'event_db',
      entities: [Event], // S'assure que TypeORM trouve votre entité
      synchronize: true, // ⚠️ Mettre false en production
    }),

    // 3. Modules Métier
    EventsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }