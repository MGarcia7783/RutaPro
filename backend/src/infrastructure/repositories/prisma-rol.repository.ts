import { Injectable } from '@nestjs/common';
import { Rol } from '../../domain/entities/rol.entity';
import { RolRepository } from '../../domain/repositories/rol.repository';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class PrismaRolRepository implements RolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorNombre(nombre: string): Promise<Rol | null> {
    const rol = await this.prisma.rol.findUnique({
      where: { nombre },
    });

    return rol ? new Rol(rol.id, rol.nombre) : null;
  }
}
