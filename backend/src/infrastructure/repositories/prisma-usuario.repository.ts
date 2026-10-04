import { Injectable } from '@nestjs/common';
import { ResultadoPaginado } from '../../domain/common/resultado-paginado';
import { Usuario } from '../../domain/entities/usuario.entity';
import { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class PrismaUsuarioRepository implements UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Método para crear un nuevo usuario
  async crear(usuario: Usuario): Promise<Usuario> {
    const nuevoUsuario = await this.prisma.usuario.create({
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        passwordHash: usuario.passwordHash,
        rolId: usuario.rolId,
        activo: usuario.activo,
      },
    });

    return this.mapear(nuevoUsuario);
  }

  // 2. Método para buscar un usuario por su email
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    // Buscamos un usuario por su email en la base de datos
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    return usuario ? this.mapear(usuario) : null;
  }

  // 3. Método para listar usuarios con paginación y filtrado
  async listar(
    nombre: string | undefined,
    activo: boolean | undefined,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<{ usuario: Usuario; rol: string }>> {
    // Creamos un objeto de filtros para la consulta
    const where: Prisma.UsuarioWhereInput = {};

    // Si se proporciona un nombre, buscamos usuarios cuyo nombre o email contenga el texto
    if (nombre) {
      where.OR = [
        {
          nombre: {
            contains: nombre,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: nombre,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (activo !== undefined) {
      where.activo = activo;
    }

    return this.listaPaginada(where, pagina, limite);
  }

  // 4. Método para obtener un usuario por su ID
  async obtenerPorId(id: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    return usuario ? this.mapear(usuario) : null;
  }

  // 5. Método para obtener un usuario por su ID junto con el nombre del rol
  async obtenerPorIdConRol(
    id: string,
  ): Promise<{ usuario: Usuario; rol: string } | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        rol: true,
      },
    });

    return usuario
      ? { usuario: this.mapear(usuario), rol: usuario.rol.nombre }
      : null;
  }

  // 6. Método para actualizar un usuario existente
  async actualizar(usuario: Usuario): Promise<Usuario> {
    const usuarioActualizado = await this.prisma.usuario.update({
      // Actualizamos solo los campos que pueden ser modificados
      where: {
        id: usuario.id,
      },
      data: {
        rolId: usuario.rolId,
        activo: usuario.activo,
      },
    });

    return this.mapear(usuarioActualizado);
  }

  // 7. Método para desactivar usuario
  async eliminar(id: string): Promise<void> {
    await this.prisma.usuario.update({
      where: { id },
      data: {
        activo: false,
      },
    });
  }

  // #region Métodos privados

  // Método privado para mapear un objeto a una instancia de Usuario
  private mapear(usuario: Prisma.UsuarioGetPayload<null>): Usuario {
    return new Usuario(
      usuario.id,
      usuario.nombre,
      usuario.email,
      usuario.passwordHash,
      usuario.rolId,
      usuario.creadoEn,
      usuario.actualizadoEn,
      usuario.activo,
    );
  }

  // Método privado para listar usuarios con paginación y filtrado
  private async listaPaginada(
    where: Prisma.UsuarioWhereInput,
    pagina: number,
    limite: number,
  ): Promise<ResultadoPaginado<{ usuario: Usuario; rol: string }>> {
    const skip = (pagina - 1) * limite;

    const [usuarios, total] = await Promise.all([
      // Obtenemos los usuarios que cumplen con los filtros
      // y aplicamos la paginación
      this.prisma.usuario.findMany({
        where,
        skip,
        take: limite,
        orderBy: {
          creadoEn: 'desc',
        },
        include: {
          rol: true,
        },
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return {
      datos: usuarios.map((usuario) => ({
        usuario: this.mapear(usuario),
        rol: usuario.rol.nombre,
      })),
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  // #endregion
}
