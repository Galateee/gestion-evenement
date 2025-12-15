import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RoleName } from '@prisma/client';

export class AssignRoleDto {
  @ApiProperty({ enum: RoleName, example: RoleName.ADMIN })
  @IsEnum(RoleName)
  role: RoleName;
}
