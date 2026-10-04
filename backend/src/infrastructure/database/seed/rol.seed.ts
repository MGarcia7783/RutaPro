import { PrismaService } from '../prisma/prisma.service';

export async function seedRoles(prisma: PrismaService): Promise<void> {
  await prisma.rol.upsert({
    where: {
      nombre: 'Administrador',
    },
    update: {},
    create: {
      nombre: 'Administrador',
      descripcion: 'Rol con permisos de administrador',
    },
  });

  await prisma.rol.upsert({
    where: {
      nombre: 'Usuario',
    },
    update: {},
    create: {
      nombre: 'Usuario',
      descripcion: 'Rol con permisos de usuario',
    },
  });

  console.log('Rol Administrador creado o actualizado.');
}
