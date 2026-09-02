import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  // Crear aplicacion
  const app = await NestFactory.create(AppModule);

  // Configurar Helmet
  app.use(helmet());

  // Configurar CORS
  app.enableCors({
    origin: [
      'http://localhost:5173', // React
      'http://localhost:4200', // Angular
    ],
    // Permite al navegador enviar la cookie HttpOnly
    // cuando el frontend y backend están trabajen juntos
    Credentials: true,
  });

  // Configurar cookies
  app.use(cookieParser());

  // Configurar pipes de validacion globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Iniciar servidor
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
