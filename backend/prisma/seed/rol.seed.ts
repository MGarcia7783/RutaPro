import { PrismaClient } from '../../src/generated/prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  await prisma.rol.create({
    data: {
      nombre: 'Administrador',
      descripcion: 'Rol con permisos de administrador',
    },
  });

  await prisma.rol.create({
    data: {
      nombre: 'Usuario',
      descripcion: 'Rol con permisos de usuario',
    },
  });
}
