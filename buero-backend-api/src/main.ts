import "reflect-metadata";
import { ClassSerializerInterceptor, Logger, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { json, text, urlencoded } from "express";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // WayForPay шле callback то як JSON, то як form-urlencoded, то як text/plain
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(text({ type: "text/plain" }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      enableImplicitConversion: true,
    })
  );

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const isProduction = configService.get<string>("NODE_ENV") === "production";
  app.useGlobalFilters(new AllExceptionsFilter(isProduction));

  const requiredEnv = [
    "DATABASE_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "WAYFORPAY_MERCHANT_ACCOUNT",
    "WAYFORPAY_MERCHANT_SECRET",
    "WAYFORPAY_MERCHANT_DOMAIN",
    "WAYFORPAY_SERVICE_URL",
  ] as const;
  const optionalEnv = [
    "PORT",
    "NODE_ENV",
    "JWT_ACCESS_EXPIRES_IN",
    "JWT_REFRESH_EXPIRES_IN",
    "COOKIE_DOMAIN",
    "COOKIE_SECURE",
    "CORS_ORIGIN",
    "WAYFORPAY_CURRENCY",
    "WAYFORPAY_RETURN_URL",
  ] as const;

  const missing = requiredEnv.filter((key) => !configService.get(key));
  if (missing.length) {
    logger.error(`Missing required env: ${missing.join(", ")}`);
    throw new Error(`Missing required env: ${missing.join(", ")}`);
  }
  requiredEnv.forEach((key) => logger.log(`Env ${key}: configured`));
  optionalEnv.forEach((key) => {
    const value = configService.get(key);
    logger.log(`Env ${key}: ${value != null && value !== "" ? "configured" : "default/empty"}`);
  });

  const port = configService.get<number>("PORT") ?? 3000;
  const corsOrigin = configService.get<string>("CORS_ORIGIN");

  app.setGlobalPrefix("api");

  app.enableCors({
    origin: corsOrigin
      ? corsOrigin.split(",").map((origin) => origin.trim())
      : true,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Buero.de API")
    .setDescription("API платформи вивчення німецької мови")
    .setVersion("1.0")
    .addTag("auth", "Реєстрація, логін, refresh, logout")
    .addTag("users", "Профіль поточного користувача")
    .addTag(
      "courses",
      "Курси: каталог (лише опубліковані), один курс по id (з модулями та матеріалами), CRUD для вчителів. Ієрархія Course → Module → Material."
    )
    .addTag("course-modules", "Модулі курсу: CRUD у контексті курсу")
    .addTag("course-materials", "Матеріали модуля: CRUD у контексті курсу та модуля")
    .addTag("subscriptions", "Купівля курсів через WayForPay та доступи")
    .addTag("payments", "Історія платежів")
    .addTag("health", "Перевірка стану сервера")
    .addTag(
      "lesson-requests",
      "Запити на заняття: студент створює, вчитель приймає/відхиляє та виставляє статус після прийняття"
    )
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header" },
      "access_token"
    )
    .addCookieAuth("access_token")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(port);
  logger.log(`Backend is running on http://localhost:${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/api-docs`);
}

bootstrap();
