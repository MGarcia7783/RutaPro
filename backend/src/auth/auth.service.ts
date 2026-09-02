import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsuarioService } from '../usuario/usuario.service';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // 1. REGISTRO
  async register(registerDto: RegisterDto) {
    // Buscar el rol del usuario por nombre
    const rolUsuario = await this.prismaService.rol.findUnique({
      where: { nombre: 'Usuario' },
    });

    if (!rolUsuario) {
      throw new Error('Rol de usuario no encontrado');
    }

    // Verificar que el email no esté registrado
    const usuarioExistente = await this.usuarioService.buscarUsuarioPorEmail(
      registerDto.email,
    );

    if (usuarioExistente) {
      throw new ConflictException('El email ya está registrado');
    }

    // Generar hash de contraseña
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    try {
      const usuario = await this.prismaService.usuario.create({
        data: {
          nombre: registerDto.nombre,
          email: registerDto.email,
          passwordHash,
          rolId: rolUsuario.id,
        },
      });

      return {
        message: 'Usuario registrado exitosamente',
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
        },
      };
    } catch {
      throw new InternalServerErrorException(
        'No fue posible registrar el usuario',
      );
    }
  }

  // 2. LOGIN
  async login(loginDto: LoginDto, response: Response) {
    // Buscar por email
    const usuario = await this.usuarioService.buscarUsuarioPorEmail(
      loginDto.email,
    );

    // Verificar que el usuario existe y tiene una contraseña registrada
    if (!usuario || !usuario.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      throw new UnauthorizedException('El usuario está inactivo');
    }

    // Comparar contraseña con el hash almacenado en la bd
    const passwordValida = await bcrypt.compare(
      loginDto.password,
      usuario.passwordHash,
    );

    // Verificar que la contraseña proporcionada sea correcta
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Información que se almacenará dentro del JWT
    const payload: JwtPayload = {
      // Sub = subject
      // Identifica al usuario al que pertenece el token
      sub: usuario.id,
      email: usuario.email,
      rolId: usuario.rolId,
    };

    // Generar access token
    const accessToken = this.jwtService.sign(payload);

    // Generar Refresh Token
    const refreshToken = this.jwtService.sign(
      {
        sub: usuario.id,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Generar hash del Refresh Token
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // Guardar el hash en la base de datos
    await this.prismaService.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        usuarioId: usuario.id,
        expiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      message: 'Inicio de sesión exitoso',
      accessToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    };
  }

  // 3. RENOVAR ACCESS TOKEN
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token no proporcionado');
    }

    let payload: { sub: string };

    try {
      payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh Token inválido o expirado');
    }

    // Buscar usuario
    const usuario = await this.usuarioService.obtenerUsuarioPorId(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      throw new UnauthorizedException('El usuario está inactivo');
    }

    // Eliminar Refresh Token que ya hayan expirado
    await this.prismaService.refreshToken.deleteMany({
      where: {
        usuarioId: usuario.id,
        expiracion: {
          lte: new Date(),
        },
      },
    });

    // Buscar los Refresh Token vigentes
    const refreshTokens = await this.prismaService.refreshToken.findMany({
      where: {
        usuarioId: usuario.id,
        expiracion: {
          // Fecha de exiración debe ser mayor que la fecha actual
          gt: new Date(),
        },
        // No usuar tokens revocados
        revocado: false,
      },
    });

    // Verificar el Refresh Token
    let tokenValido = false;

    for (const token of refreshTokens) {
      if (await bcrypt.compare(refreshToken, token.tokenHash)) {
        tokenValido = true;
        break;
      }
    }

    if (!tokenValido) {
      throw new UnauthorizedException('Refresh Token no válido');
    }

    // Generar nuevo Access Token
    const accessToken = this.jwtService.sign({
      sub: usuario.id,
      email: usuario.email,
      rolId: usuario.rolId,
    });

    return {
      accessToken,
    };
  }

  // 4. REVOCAR REFRESH TOKEN
  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token no proporcionado');
    }

    // Buscar todos lo Refresh Token del usuario
    // Primero obtener el usuario a partir del token
    let payload: { sub: string };

    try {
      payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    // Buscar los tokens registrados del usuario
    const refreshTokens = await this.prismaService.refreshToken.findMany({
      where: {
        usuarioId: payload.sub,
      },
    });

    // Buscar cuál de los hashes corresponden al token recibido
    for (const token of refreshTokens) {
      const tokenValido = await bcrypt.compare(refreshToken, token.tokenHash);

      if (tokenValido) {
        await this.prismaService.refreshToken.delete({
          where: {
            id: token.id,
          },
        });

        return {
          message: 'Sesión cerrada correctamente',
        };
      }
    }
    throw new UnauthorizedException('Refresh Token no válido');
  }
}
