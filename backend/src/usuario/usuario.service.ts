import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import * as bcrypt from 'bcrypt';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly prismaService: PrismaService) {}

  // BUSCAR USUARIO POR EMAIL
  async buscarUsuarioPorEmail(email: string) {
    return this.prismaService.usuario.findUnique({
      where: {
        email,
      },
    });
  }

  // OBTENER USUARIO POR ID
  async obtenerUsuarioPorId(id: string) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rolId: true,
        activo: true,
        creadoEn: true,
        actualizadoEn: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  // BUSCAR ROL POR ID
  async obtenerRolPorId(id: string) {
    const rol = await this.prismaService.rol.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nombre: true,
      },
    });

    if (!rol) {
      throw new NotFoundException('El rol especificado no existe');
    }
    return rol;
  }

  // 1. CREAR USUARIO
  async crearUsuario(crearUsuarioDto: CrearUsuarioDto) {
    // Verificar que el email no esté registrado
    const usuarioExistente = await this.buscarUsuarioPorEmail(
      crearUsuarioDto.email,
    );

    if (usuarioExistente) {
      throw new ConflictException('El email ya se encuentra registrado');
    }

    // Verificar que el rol exista
    await this.obtenerRolPorId(crearUsuarioDto.rolId);

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(crearUsuarioDto.password, 10);

    try {
      // Crear usuario
      return await this.prismaService.usuario.create({
        data: {
          nombre: crearUsuarioDto.nombre,
          email: crearUsuarioDto.email,
          passwordHash,
          rolId: crearUsuarioDto.rolId,
        },
        select: {
          id: true,
          nombre: true,
          email: true,
          rolId: true,
          activo: true,
          creadoEn: true,
        },
      });
    } catch {
      throw new InternalServerErrorException('No fue posible crear el usuario');
    }
  }

  // 2. LSITAR USUARIOS
  async listarUsuarios() {
    try {
      return this.prismaService.usuario.findMany({
        where: {
          activo: true,
        },
        select: {
          id: true,
          nombre: true,
          email: true,
          rolId: true,
          activo: true,
          creadoEn: true,
        },
        orderBy: {
          creadoEn: 'desc',
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'No fue posible obtener los usuarios',
      );
    }
  }

  // 3. OBTENER USUARIO POR ID
  async obtenerUsuario(id: string) {
    return this.obtenerUsuarioPorId(id);
  }

  // 4. ACTUALIZAR USUARIO
  async actualizarUsuario(
    id: string,
    actualizarUsuarioDto: ActualizarUsuarioDto,
  ) {
    // Verificar que el usuario exista
    await this.obtenerUsuarioPorId(id);

    // Si modifica el rol, verificar que exista
    if (actualizarUsuarioDto.rolId) {
      await this.obtenerRolPorId(actualizarUsuarioDto.rolId);
    }

    try {
      return this.prismaService.usuario.update({
        where: {
          id,
        },
        data: {
          rolId: actualizarUsuarioDto.rolId,
          activo: actualizarUsuarioDto.activo,
        },
        select: {
          id: true,
          nombre: true,
          email: true,
          rolId: true,
          activo: true,
          creadoEn: true,
          actualizadoEn: true,
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'No fue posible actualizar el usuario',
      );
    }
  }

  // 5. ELIMINARUSUARIO
  async eliminarUsuario(id: string, usuarioActualId: string) {
    // Verificar que el usuario exista
    const usuario = await this.obtenerUsuarioPorId(id);

    // Un administrador no puede eliminarse a sí mismo
    if (id === usuarioActualId) {
      throw new BadRequestException('No puedes eliminarte a ti mismo');
    }

    try {
      // Obtener el rol Administrador
      const rolAdministrador = await this.prismaService.rol.findUnique({
        where: {
          nombre: 'Administrador',
        },
      });

      // Verificar que el rol exista
      if (!rolAdministrador) {
        throw new InternalServerErrorException(
          'No fue posible verificar el rol Administrador',
        );
      }

      // Verificar si el usuario a eliminar es un Administrador
      if (usuario.rolId === rolAdministrador.id) {
        // Contar los administradores activos
        const administradoresActivos = await this.prismaService.usuario.count({
          where: {
            rolId: rolAdministrador.id,
            activo: true,
          },
        });

        if (administradoresActivos === 1) {
          throw new BadRequestException(
            'No puedes eliminar el último administrador activo',
          );
        }
      }

      // Desactivar usuario
      await this.prismaService.usuario.update({
        where: {
          id,
        },
        data: {
          activo: false,
        },
      });

      return { message: 'Usuario eliminado exitosamente' };
    } catch {
      throw new InternalServerErrorException(
        'No fue posible eliminar el usuario',
      );
    }
  }
}
