import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jw.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      // Indicar a Nest qué clave usar para firmar los tokens
      secret: process.env.JWT_SECRET,
      signOptions: {
        // Access tokens dura 15 minutos
        expiresIn: '8h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
})
export class AuthModule {}
