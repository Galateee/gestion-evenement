import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { FilterEventDto } from '../dto/filter-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../../../../shared/enums';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth
} from '@nestjs/swagger';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  // --------------------
  // ROUTES PROTÉGÉES (CREATE)
  // --------------------
  @Post()
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new event',
    description: 'Create an event. Restricted to Organizers and Admins.'
  })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Event successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        title: { type: 'string', example: 'Tech Conference 2024' },
        status: { type: 'string', example: 'DRAFT' },
        organizerId: { type: 'string', example: 'user-uuid-123' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not have the required role' })
  create(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.eventsService.create(dto, req.user);
  }

  // --------------------
  // ROUTES PUBLIQUES (GET)
  // --------------------

  @Get('upcoming')
  @ApiOperation({
    summary: 'Get upcoming events (Public)',
    description: 'Retrieve a list of events scheduled for the future.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of upcoming events',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-1' },
          title: { type: 'string', example: 'Future Event' },
          date: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  @Get()
  @ApiOperation({
    summary: 'Get all events (Public)',
    description: 'Retrieve a list of events with optional filters.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of events retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          title: { type: 'string', example: 'Music Festival' }
        }
      }
    }
  })
  findAll(@Query() filterDto: FilterEventDto) {
    return this.eventsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event details (Public)' })
  @ApiParam({ name: 'id', description: 'The ID of the event to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Event details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        title: { type: 'string', example: 'Music Festival' },
        description: { type: 'string', example: 'A great festival' },
        location: { type: 'string', example: 'Paris' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  // --------------------
  // ROUTES PROTÉGÉES (UPDATE / DELETE / ACTIONS)
  // --------------------

  @Patch(':id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an event' })
  @ApiParam({ name: 'id', description: 'The ID of the event to update' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string', example: 'Updated Title' }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner or admin' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Req() req: any,
  ) {
    return this.eventsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an event' })
  @ApiParam({ name: 'id', description: 'The ID of the event to delete' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.remove(id, req.user);
  }

  @Patch(':id/publish')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish an event' })
  @ApiParam({ name: 'id', description: 'ID of the event to publish' })
  @ApiResponse({
    status: 200,
    description: 'Event published',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', example: 'PUBLISHED' }
      }
    }
  })
  publish(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.publish(id, req.user);
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel an event' })
  @ApiParam({ name: 'id', description: 'ID of the event to cancel' })
  @ApiResponse({
    status: 200,
    description: 'Event cancelled',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', example: 'CANCELLED' }
      }
    }
  })
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.cancel(id, req.user);
  }

  @Patch(':id/complete')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Mark event as completed' })
  @ApiParam({ name: 'id', description: 'ID of the event to complete' })
  @ApiResponse({
    status: 200,
    description: 'Event marked as completed',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', example: 'COMPLETED' }
      }
    }
  })
  complete(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.markCompleted(id, req.user);
  }
}