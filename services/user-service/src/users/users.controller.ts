import { Body, Controller, Delete, Get, Param, Put, UseGuards, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ForbiddenException } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AssignRoleDto } from './dto/assign-role.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // ✅ GET + PUT + DELETE protégés par JWT
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile by id' })
getUserById(@Param('id') id: string, @CurrentUser() user: any) {
  const isSelf = user.id === id;
  const isAdmin = (user.roles ?? []).some((r) => r.role.name === RoleName.ADMIN);

  if (!isSelf && !isAdmin) {
    throw new ForbiddenException('Access denied');
  }

  return this.usersService.getUserById(id);
}


  @Put(':id')
  @ApiOperation({ summary: 'Update user profile' })
 updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() user: any) {
  const isSelf = user.id === id;
  const isAdmin = (user.roles ?? []).some((r) => r.role.name === RoleName.ADMIN);

  if (!isSelf && !isAdmin) {
    throw new ForbiddenException('Access denied');
  }

  return this.usersService.updateUser(id, dto);
}

  @UseGuards(RolesGuard) // ✅ ici s’ajoute au JwtAuthGuard du controller
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (admin)' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
  @UseGuards(RolesGuard)
@Roles(RoleName.ADMIN)
@Post(':id/role')
@ApiOperation({ summary: 'Assign role to user (admin)' })
assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto) {
  return this.usersService.assignRole(id, dto.role);
}

}
