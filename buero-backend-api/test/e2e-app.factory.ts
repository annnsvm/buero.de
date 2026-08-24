import { ValidationPipe, INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { AllExceptionsFilter } from "src/common/filters/all-exceptions.filter";
import { AppModule } from "src/app.module";
import { WayForPayService } from "src/modules/wayforpay/wayforpay.service";
import cookieParser from "cookie-parser";
import { json, text, urlencoded } from "express";

/**
 * Частковий мок WayForPay для e2e (без мережевих викликів).
 * Підпис і статуси лишаються справжніми — підміняються лише HTTP-методи.
 */
export type E2eWayForPayMock = Partial<
  Pick<WayForPayService, "createPaymentPageUrl" | "checkStatus">
>;

/**
 * Bootstrap як у main.ts (body parsers + cookies + prefix + validation).
 * `E2E_TEST=true` у setup-e2e-env.ts вимикає Throttler.
 *
 * @param options.wayForPayMock — підміняє мережеві методи глобального WayForPayService.
 */
export async function createE2eApp(options?: {
  wayForPayMock?: E2eWayForPayMock;
}): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication({ bodyParser: false });

  if (options?.wayForPayMock) {
    const wayForPay = app.get(WayForPayService);
    Object.assign(wayForPay, options.wayForPayMock);
  }

  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(text({ type: "text/plain" }));
  app.use(cookieParser());
  const config = app.get(ConfigService);
  const isProduction = config.get<string>("NODE_ENV") === "production";
  app.useGlobalFilters(new AllExceptionsFilter(isProduction));
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
