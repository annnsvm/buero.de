import { ValidationPipe, INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import cookieParser from "cookie-parser";
import { json } from "express";

/**
 * Мінімальний bootstrap як у main.ts (body parser + cookies + prefix + validation),
 * без Swagger. Очікується `E2E_TEST=true` у env (див. test/setup-e2e-env.ts), щоб Throttler не блокував запити.
 */
export async function createE2eApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(
    json({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- express verify callback
      verify: (req: any, _res, buf: Buffer) => {
        if (req.originalUrl?.includes("webhooks/stripe")) req.rawBody = buf;
      },
    }),
  );
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();
  return app;
}
