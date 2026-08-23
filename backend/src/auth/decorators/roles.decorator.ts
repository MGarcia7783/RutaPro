import { SetMetadata } from '@nestjs/common';

// Nombre de la metadata donde se almacenarán los roles
export const ROLES_KEY = 'roles';

// Decorador que permite indicar qué roles pueden acceder
// a un endpoint
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
