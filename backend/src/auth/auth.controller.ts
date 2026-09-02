import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuards } from './guards/jwt-auth.guard';
import { AuthUser } from './interfaces/auth-user.interface';
import type { Request, Response } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 5 solicitudes por minuto
  @Post('register')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // 5 solicitudes por minuto
  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginDto, response);
  }

  @Get('me')
  @UseGuards(JwtAuthGuards)
  me(@Req() request: { user: AuthUser }) {
    return request.user;
  }

  // 10 solicitudes por minuto
  @Post('refresh')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  refresh(@Req() request: { cookies?: { refresh_token?: string } }) {
    const refreshToken = request.cookies?.refresh_token;

    return this.authService.refresh(refreshToken ?? '');
  }

  @Post('logout')
  logout(
    @Req()
    request: Request & {
      cookies?: {
        refresh_token?: string;
      };
    },
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token ?? '';

    return this.authService.logout(refreshToken ?? '').then((resultado) => {
      response.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return resultado;
    });
  }
}
