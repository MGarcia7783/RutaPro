import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ObjetivoModule } from './objetivo/objetivo.module';
import { RutaModule } from './ruta/ruta.module';
import { EtapaModule } from './etapa/etapa.module';
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

        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),

        PORT: Joi.number().default(3000),
      }),
    }),

    AuthModule,
    PrismaModule,
    ObjetivoModule,
    RutaModule,
    EtapaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
