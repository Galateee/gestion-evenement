import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RoleName } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: SignUpDto) {
    const userExist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExist) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    // rôle par défaut : PARTICIPANT
    const participantRole = await this.prisma.role.findUnique({
      where: { name: RoleName.PARTICIPANT },
    });

    if (participantRole) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: participantRole.id,
        },
      });
    }

    return this.generateToken(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwt.sign(payload),
    };
  }
  async assignRoleToUser(userId: string, roleName: RoleName) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new BadRequestException('User not found');

  const role = await this.prisma.role.findUnique({ where: { name: roleName } });
  if (!role) throw new BadRequestException('Role not found');

  // évite les doublons (car @@id([userId, roleId]) dans UserRole)
  await this.prisma.userRole.upsert({
    where: {
      userId_roleId: { userId, roleId: role.id },
    },
    update: {},
    create: { userId, roleId: role.id },
  });

  return { ok: true, userId, role: roleName };
}
}
