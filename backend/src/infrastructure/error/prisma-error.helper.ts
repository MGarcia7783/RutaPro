import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';

export class PrismaErrorHelper {
  static manejar(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Manejar errores conocidos de Prisma
      switch (error.code) {
        case 'P2002':
          throw new ConflictException(
            'Ya existe un registro con los datos proporcionados.',
          );

        case 'P2003':
          throw new ConflictException(
            'No se puede realizar la operación porque existen registros relacionados.',
          );

        case 'P2025':
          throw new NotFoundException(
            'El recurso solicitado no fue encontrado.',
          );
      }
    }
    throw error;
  }
}
