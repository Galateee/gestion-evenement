import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { FilterEventDto } from '../dto/filter-event.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../../../../shared/enums';

@Controller('events')
@UseGuards(RolesGuard)
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
    create(@Body() createEventDto: CreateEventDto) {
        return this.eventsService.create(createEventDto);
    }

    @Get()
    findAll(@Query() filterDto: FilterEventDto) {
        return this.eventsService.findAll(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
        return this.eventsService.update(id, updateEventDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.eventsService.remove(id);
    }
    @Patch(':id/publish')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  publish(@Param('id') id: string) {
    return this.eventsService.publish(id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  cancel(@Param('id') id: string) {
    return this.eventsService.cancel(id);
  }

  @Patch(':id/soldout')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  markSoldOut(@Param('id') id: string) {
    return this.eventsService.markCompleted(id);
  }
}