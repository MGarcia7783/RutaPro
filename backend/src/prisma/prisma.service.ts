import 'dotenv/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL no está definido en las variables de entorno',
      );
    }

    // PrismaPg es un adaptador que permite a Prisma comunicar con PostgreSQL
    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    // Llamar al constructor de PrismaClient con el adaptador
    super({ adapter });
  }

  // Conectar a la base de datos cuando el módulo se inicializa
  async onModuleInit() {
    await this.$connect();
  }

  // Desconectar de la base de datos cuando el módulo se destruye
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
