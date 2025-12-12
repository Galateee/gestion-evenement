import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

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

        return this.generateToken({ id: user.id, email: user.email });
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken({ id: user.id, email: user.email });
    }


    private generateToken(user: { id: string; email: string }) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwt.sign(payload),
        }
    }
}
