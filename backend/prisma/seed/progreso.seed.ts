import { PrismaClient } from '../../src/generated/prisma/client';

export async function seedProgresos(prisma: PrismaClient) {
  // Buscar usuarios para crear los progresos
  // findUnique se utiliza para buscar un registro único basado en un campo único
  const mario = await prisma.usuario.findUnique({
    where: {
      email: 'mario@rutapro.com',
    },
  });

  const ana = await prisma.usuario.findUnique({
    where: {
      email: 'ana@rutapro.com',
    },
  });

  // Buscar rutas para crear los progresos
  // findFirst se utiliza para buscar el primer registro que coincida con los criterios
  const rutaTypescript = await prisma.ruta.findFirst({
    where: {
      nombre: 'Fundamentos de TypeScript',
    },
  });

  const rutaNestJS = await prisma.ruta.findFirst({
    where: {
      nombre: 'Backend con NestJS',
    },
  });

  const rutaReact = await prisma.ruta.findFirst({
    where: {
      nombre: 'Frontend con React',
    },
  });

  // Verificar que los usuarios y rutas existen antes de crear los progresos
  if (!mario || !ana || !rutaTypescript || !rutaNestJS || !rutaReact) {
    throw new Error(
      'No se encontraron los usuarios o rutas necesarios para crear los progresos.',
    );
  }

  // Crear progresos para los usuarios en las rutas correspondientes
  await prisma.progreso.createMany({
    data: [
      {
        usuarioId: mario.id,
        rutaId: rutaTypescript.id,
        estado: 'Completado',
        porcentaje: 100,
      },
      {
        usuarioId: mario.id,
        rutaId: rutaNestJS.id,
        estado: 'En progreso',
        porcentaje: 60,
      },
      {
        usuarioId: ana.id,
        rutaId: rutaReact.id,
        estado: 'En progreso',
        porcentaje: 35,
      },
    ],
  });

  console.log('Progresos creados.');
}
