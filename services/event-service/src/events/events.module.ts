import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from '../entities/event.entity';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Event])],
    controllers: [EventsController],
    providers: [EventsService, AuthService, JwtAuthGuard, RolesGuard],
    exports: [EventsService], // Export si nécessaire dans d'autres modules
})
export class EventsModule { }