import { PrismaClient } from '../../src/generated/prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsuarios(prisma: PrismaClient) {
  //Buscar los roles que serán asignados a los usuarios
  const rolAdmin = await prisma.rol.findUnique({
    where: {
      nombre: 'Administrador',
    },
  });

  const rolUsuario = await prisma.rol.findUnique({
    where: {
      nombre: 'Usuario',
    },
  });

  // Verificar que los roles existan antes de crear los usuarios.
  if (!rolAdmin || !rolUsuario) {
    throw new Error(
      'No se encontraron los roles necesarios para crear los usuarios.',
    );
  }

  // Generar los hashes de contraseña
  const passwordAdmin = await bcrypt.hash('Admin2026!', 10);
  const passwordUser = await bcrypt.hash('User2026!', 10);

  await prisma.usuario.createMany({
    data: [
      {
        nombre: 'Marcos Fuertes',
        email: 'marcos@rutapro.com',
        passwordHash: passwordAdmin,
        rolId: rolAdmin.id,
      },
      {
        nombre: 'Ana López',
        email: 'ana@rutapro.com',
        passwordHash: passwordUser,
        rolId: rolUsuario.id,
      },
    ],
  });

  console.log('Usuarios creados.');
}
