import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

const DEFAULT_CORS_ORIGIN = 'http://localhost:3000';

// CORS_ORIGIN — список разрешённых origin через запятую.
const parseOrigins = (value: string | undefined): string[] =>
  (value ?? DEFAULT_CORS_ORIGIN)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.enableCors({ origin: parseOrigins(process.env.CORS_ORIGIN) });
  app.enableShutdownHooks();
  await app.listen(process.env.API_PORT ?? 4000);
}

bootstrap();
