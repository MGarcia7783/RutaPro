import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../dist/src/auth/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // 1. Registro
  async register(registerDto: RegisterDto) {
    const rolUsuario = await this.prismaService.rol.findUnique({
      where: { nombre: 'Usuario' },
    });

    if (!rolUsuario) {
      throw new Error('Rol de usuario no encontrado');
    }

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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
      throw new InternalServerErrorException(
        'No fue posible registrar el usuario',
      );
    }
  }

  // 2. Login
  async login(loginDto: LoginDto) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    // Verificar que el usuario existe y tiene una contraseña registrada
    if (!usuario || !usuario.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas');
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

    // Preparar la información que se almacenará dentro del JWT
    const payload: JwtPayload = {
      // Sub = subject
      // Identifica al usuario al que pertenece el token
      sub: usuario.id,
      email: usuario.email,
      rolId: usuario.rolId,
    };

    // Generar y firmar el access token
    const accessToken = this.jwtService.sign(payload);

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
}
