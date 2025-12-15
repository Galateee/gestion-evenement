import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { FilterEventDto } from '../dto/filter-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../../../../shared/enums';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  create(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.eventsService.create(dto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() filterDto: FilterEventDto, @Req() req: any) {
    console.log('Récupération des événements par:', req.user.email);
    return this.eventsService.findAll(filterDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Req() req: any,
  ) {
    return this.eventsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.remove(id, req.user);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  publish(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.publish(id, req.user);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.cancel(id, req.user);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  complete(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.markCompleted(id, req.user);
  }

  @Get('upcoming')
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }
}