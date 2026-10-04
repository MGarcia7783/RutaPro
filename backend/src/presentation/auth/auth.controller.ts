import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterUseCase } from '../../application/auth/register.use-case';
import { LoginUseCase } from '../../application/auth/login.use-case';
import { Throttle } from '@nestjs/throttler';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuards } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { AuthUser } from '../../application/auth/interface/auth-user.interface';

import type { Request, Response } from 'express';
import { LogoutUseCase } from '../../application/auth/logout.use-case';
import { RefreshTokenUseCase } from '../../application/auth/refresh-token.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,

    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  // Registrar usuario
  @Post('register')
  // Limitar a 5 solicitudes por minuto
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async register(@Body() registerDto: RegisterDto) {
    return this.registerUseCase.ejecutar(
      registerDto.nombre,
      registerDto.email,
      registerDto.password,
    );
  }

  // Iniciar sesión
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const resultado = await this.loginUseCase.ejecutar(
      loginDto.email,
      loginDto.password,
    );

    // Guardar Refresh Token en cookie HttpOnly
    response.cookie('refresh_token', resultado.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return {
      mensaje: 'Inicio de sesión exitoso',
      accessToken: resultado.accessToken,
      usuario: resultado.usuario,
    };
  }

  // Obtener información del usuario autenticado
  @Get('me')
  @UseGuards(JwtAuthGuards)
  me(@Req() request: Request) {
    const usuario = request.user as AuthUser;

    return usuario;
  }

  // Refrescar el token de acceso utilizando el Refresh Token
  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async refresh(@Req() request: Request) {
    const refreshToken = request.cookies?.refresh_token as string;

    const accessToken = await this.refreshTokenUseCase.ejecutar(refreshToken);

    return {
      accessToken,
    };
  }

  // Cerrar sesión y eliminar el Refresh Token
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token as string | undefined;

    if (refreshToken) {
      await this.logoutUseCase.ejecutar(refreshToken);
    }

    response.clearCookie('refresh_token');

    return {
      mensaje: 'Sesión cerrada exitosamente',
    };
  }
}
