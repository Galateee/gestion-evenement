/**
 * Module principal du ticket-service
 * Configure TypeORM, charge les modules métier (TicketsModule)
 * et initialise les configurations globales (ConfigModule)
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TicketsModule } from './tickets/tickets.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT || 5432),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'tickets',
      synchronize: true,
      autoLoadEntities: true,
    }),
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
