import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Crear aplicacion
  const app = await NestFactory.create(AppModule);

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
