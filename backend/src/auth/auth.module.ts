import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jw.strategy';
import { RolesGuard } from './guards/roles.guard';
import { UsuarioModule } from '../usuario/usuario.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      // Indicar a Nest qué clave usar para firmar los tokens
      secret: process.env.JWT_SECRET,
      signOptions: {
        // Access tokens dura 2 horas
        expiresIn: '2h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
})
export class AuthModule {}
