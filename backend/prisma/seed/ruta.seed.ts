import { PrismaClient } from '../../src/generated/prisma/client';

export async function seedRutas(prisma: PrismaClient) {
  await prisma.ruta.createMany({
    data: [
      {
        nombre: 'Fundamentos de TypeScript',
        descripcion: 'Ruta para aprender los fundamentos de TypeScript.',
      },
      {
        nombre: 'Backend con NestJS',
        descripcion: 'Ruta para desarrollar APIs utilizando NestJS.',
      },
      {
        nombre: 'Frontend con React',
        descripcion:
          'Ruta para desarrollar aplicaciones frontend utilizando React.',
      },
    ],
  });

  console.log('Rutas creadas.');
}
