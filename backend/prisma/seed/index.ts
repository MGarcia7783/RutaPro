import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client';

import { seedProgresos } from './progreso.seed';
import { seedRutas } from './ruta.seed';
import { seedUsuarios } from './usuario.seed';

// Index será el encargado de ejecutar los seeder en el oreden correcto.

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando el seeding de la base de datos...');

  // Ejecutar los seeders en el orden correcto
  await seedUsuarios(prisma);
  await seedRutas(prisma);
  await seedProgresos(prisma);

  console.log('Seeding completado.');
}

main()
  .catch((error) => {
    console.error('Error durante el seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
