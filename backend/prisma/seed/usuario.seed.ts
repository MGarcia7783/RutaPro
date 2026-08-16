import { PrismaClient } from '../../src/generated/prisma/client';

export async function seedUsuarios(prisma: PrismaClient) {
  await prisma.usuario.create({
    data: {
      nombre: 'Mario García',
      email: 'mario@rutapro.com',
    },
  });

  await prisma.usuario.createMany({
    data: [
      {
        nombre: 'Ana López',
        email: 'ana@rutapro.com',
      },
      {
        nombre: 'Carlos Pérez',
        email: 'carlos@rutapro.com',
      },
    ],
  });

  console.log('Usuarios creados.');
}
