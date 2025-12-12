import {Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req,} from '@nestjs/common';
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
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  create(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.eventsService.create(dto, req.user);
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
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Req() req: any,
  ) {
    return this.eventsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.remove(id, req.user);
  }

  @Patch(':id/publish')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  publish(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.publish(id, req.user);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.cancel(id, req.user);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  complete(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.markCompleted(id, req.user);
  }
}
