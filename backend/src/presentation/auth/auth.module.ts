import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';
import { PrismaUsuarioRepository } from '../../infrastructure/repositories/prisma-usuario.repository';
import { PrismaRolRepository } from '../../infrastructure/repositories/prisma-rol.repository';
import { PrismaRefreshTokenRepository } from '../../infrastructure/repositories/prisma-refresh-token.repository';
import { LoginUseCase } from '../../application/auth/login.use-case';
import { RegisterUseCase } from '../../application/auth/register.use-case';
import { JwtStrategy } from '../../infrastructure/auth/strategies/jwt.strategy';
import { USUARIO_REPOSITORY } from '../../application/common/usuario-repository.token';
import { ROL_REPOSITORY } from '../../application/common/rol-repository.token';
import { REFRESH_TOKEN_REPOSITORY } from '../../application/common/refresh-token-repository.token';
import { RefreshTokenUseCase } from '../../application/auth/refresh-token.use-case';
import { LogoutUseCase } from '../../application/auth/logout.use-case';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SignOptions } from 'jsonwebtoken';

@Module({
  imports: [
    ConfigModule,
    PassportModule,

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: configService.getOrThrow<SignOptions['expiresIn']>(
            'JWT_ACCESS_TOKEN_EXPIRATION',
          ),
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    PrismaService,

    // Repositorios
    {
      provide: USUARIO_REPOSITORY,
      useClass: PrismaUsuarioRepository,
    },
    {
      provide: ROL_REPOSITORY,
      useClass: PrismaRolRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },

    // Casos de uso
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,

    // Estragia JWT
    JwtStrategy,

    // *Throttling global*
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AuthModule {}
