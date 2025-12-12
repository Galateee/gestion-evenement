import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as StringValue },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
