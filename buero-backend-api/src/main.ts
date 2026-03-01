import 'reflect-metadata';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      enableImplicitConversion: true,
    }),
  );

  app.use(cookieParser());

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') ?? 3000;
  const corsOrigin = configService.get<string>('CORS_ORIGIN');

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: corsOrigin
      ? corsOrigin.split(',').map((origin) => origin.trim())
      : true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Buero.de API')
    .setDescription('API платформи вивчення німецької мови')
    .setVersion('1.0')
    .addTag('auth', 'Реєстрація, логін, refresh, logout')
    .addTag('users', 'Профіль поточного користувача')
    .addTag('health', 'Перевірка стану сервера')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access_token',
    )
    .addCookieAuth('access_token')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Backend is running on http://localhost:${port}`);
}

bootstrap();
