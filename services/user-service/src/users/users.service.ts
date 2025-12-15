import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // GET /users/:id
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async update(
    id: string,
    data: {
      email?: string;
      name?: string;
    },
  ) {
    await this.findById(id); 

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
  async remove(id: string) {
    await this.findById(id);
    await this.prisma.userRole.deleteMany({
      where: { userId: id },
    });
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
