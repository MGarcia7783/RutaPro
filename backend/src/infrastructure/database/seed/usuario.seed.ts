import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

export async function seedUsuarios(prisma: PrismaService): Promise<void> {
  //Buscar los roles que serán asignados a los usuarios
  const rolAdmin = await prisma.rol.findUnique({
    where: {
      nombre: 'Administrador',
    },
  });

  // Verificar que los roles existan antes de crear los usuarios.
  if (!rolAdmin) {
    throw new Error('No se encontró el rol de Administrador.');
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      email: 'admin@rutapro.com',
    },
  });

  if (usuarioExistente) {
    console.log('Usuario admin ya existe.');
    return;
  }

  // Generar los hashes de contraseña
  const passwordAdmin = await bcrypt.hash('Admin2026!', 10);

  await prisma.usuario.create({
    data: {
      nombre: 'Super Administrador',
      email: 'admin@rutapro.com',
      passwordHash: passwordAdmin,
      rolId: rolAdmin.id,
    },
  });

  console.log('Usuario creado.');
}
