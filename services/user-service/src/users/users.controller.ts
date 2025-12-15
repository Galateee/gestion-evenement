import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // ✅ GET + PUT + DELETE protégés par JWT
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile by id' })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user profile' })
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @UseGuards(RolesGuard) // ✅ ici s’ajoute au JwtAuthGuard du controller
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (admin)' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
