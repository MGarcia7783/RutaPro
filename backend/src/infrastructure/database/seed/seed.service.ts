import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { seedRoles } from './rol.seed';
import { seedUsuarios } from './usuario.seed';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    console.log('Iniciando verificación de datos iniciales...');

    await seedRoles(this.prisma);
    await seedUsuarios(this.prisma);

    console.log('Verificación de datos iniciales completada.');
  }
}
