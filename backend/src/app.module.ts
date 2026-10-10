import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TareasModule } from './presentation/tareas/tareas.module';
import { UsuariosModule } from './presentation/usuarios/usuarios.module';
import { AuthModule } from './presentation/auth/auth.module';
import { SeedService } from './infrastructure/database/seed/seed.service';
import { RutasModule } from './presentation/rutas/rutas.module';
import { EtapasModule } from './presentation/etapas/etapas.module';
import { ProgresoModule } from './presentation/progreso/progreso.module';
import * as Joi from 'joi';

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,

      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().required(),

        JWT_REFRESH_TOKEN_EXPIRATION_DAYS: Joi.number()
          .integer()
          .positive()
          .required(),

        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),

        PORT: Joi.number().default(3000),
      }),
    }),

    AuthModule,
    PrismaModule,
    RutasModule,
    EtapasModule,
    TareasModule,
    UsuariosModule,
    ProgresoModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
