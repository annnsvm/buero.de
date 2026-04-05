import { ValidationPipe, INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { AllExceptionsFilter } from "src/common/filters/all-exceptions.filter";
import { AppModule } from "src/app.module";
import { StripeService } from "src/modules/stripe/stripe.service";
import cookieParser from "cookie-parser";
import { json } from "express";

/**
 * Частковий мок Stripe для e2e (без реальних викликів API).
 * Поля, яких немає в об'єкті, заповнюються no-op jest.fn().
 */
export type E2eStripeServiceMock = Partial<
  Pick<
    StripeService,
    | "createCustomer"
    | "createCheckoutSession"
    | "createBillingPortalSession"
    | "createProduct"
    | "createPrice"
    | "constructWebhookEvent"
    | "getClient"
  >
>;

function buildStripeMock(overrides: E2eStripeServiceMock = {}) {
  return {
    createCustomer: jest.fn(),
    createCheckoutSession: jest.fn(),
    createBillingPortalSession: jest.fn(),
    createProduct: jest.fn(),
    createPrice: jest.fn(),
    constructWebhookEvent: jest.fn(),
    getClient: jest.fn(() => ({
      subscriptions: { retrieve: jest.fn() },
    })),
    ...overrides,
  };
}

/**
 * Bootstrap як у main.ts (body parser + rawBody для Stripe + cookies + prefix + validation).
 * `E2E_TEST=true` у setup-e2e-env.ts вимикає Throttler.
 *
 * @param options.stripeServiceMock — якщо задано, підміняє глобальний StripeService (без реального sk_test).
 */
export async function createE2eApp(options?: {
  stripeServiceMock?: E2eStripeServiceMock;
}): Promise<INestApplication> {
  let moduleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });
  if (options?.stripeServiceMock) {
    moduleBuilder = moduleBuilder
      .overrideProvider(StripeService)
      .useValue(buildStripeMock(options.stripeServiceMock));
  }
  const moduleRef = await moduleBuilder.compile();
  const app = moduleRef.createNestApplication({ bodyParser: false });
  app.use(
    json({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- express verify callback
      verify: (req: any, _res, buf: Buffer) => {
        if (req.originalUrl?.includes("webhooks/stripe")) req.rawBody = buf;
      },
    }),
  );
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
