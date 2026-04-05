import { INestApplication } from "@nestjs/common";
import request from "supertest";
import Stripe from "stripe";
import { PrismaService } from "src/prisma/prisma.service";
import { createE2eApp } from "./e2e-app.factory";

function getSetCookieHeaders(headers: { "set-cookie"?: string | string[] }): string[] {
  const raw = headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

describe("Subscriptions & Billing (e2e)", () => {
  const password = "E2ePass123";

  describe("HTTP (mocked Stripe)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let userId: string;
    let courseId: string;
    let cookieHeader: string;

    beforeAll(async () => {
      if (!process.env.DATABASE_URL) {
        throw new Error(
          "E2E: DATABASE_URL не задано. Вкажи .env з робочою PostgreSQL.",
        );
      }
      app = await createE2eApp({
        stripeServiceMock: {
          createCustomer: jest.fn().mockResolvedValue({ id: "cus_e2e_mock" }),
          createCheckoutSession: jest
            .fn()
            .mockResolvedValue({ url: "https://checkout.test/e2e-session" }),
          createBillingPortalSession: jest
            .fn()
            .mockResolvedValue({ url: "https://billing.test/e2e-portal" }),
        },
      });
      prisma = app.get(PrismaService);
    });

    afterAll(async () => {
      if (userId) {
        await prisma.payment.deleteMany({ where: { userId } });
        await prisma.userCourseAccess.deleteMany({ where: { userId } });
        await prisma.user.deleteMany({ where: { id: userId } });
      }
      if (courseId) {
        await prisma.course.deleteMany({ where: { id: courseId } });
      }
      await prisma.$disconnect();
      await app.close();
    });

    it("POST checkout → url; GET subscriptions/me; POST portal → url; GET payments/me", async () => {
      const email = `sub_e2e_${Date.now()}_${Math.random().toString(36).slice(2)}@test.local`;
      const reg = await request(app.getHttpServer())
        .post("/api/auth/register")
        .send({
          email,
          password,
          role: "student",
          language: "en",
        })
        .expect(201);

      userId = reg.body.user.id;
      cookieHeader = getSetCookieHeaders(reg.headers)
        .map((c) => c.split(";")[0])
        .join("; ");

      const course = await prisma.course.create({
        data: {
          title: "E2E Subscriptions",
          language: "en",
          isPublished: true,
          stripePriceId: "price_e2e_mock",
        },
      });
      courseId = course.id;

      const checkout = await request(app.getHttpServer())
        .post("/api/subscriptions/checkout")
        .set("Cookie", cookieHeader)
        .send({ course_id: courseId })
        .expect(201);

      expect(checkout.body.url).toBe("https://checkout.test/e2e-session");

      const me = await request(app.getHttpServer())
        .get("/api/subscriptions/me")
        .set("Cookie", cookieHeader)
        .expect(200);

      expect(Array.isArray(me.body)).toBe(true);

      const portal = await request(app.getHttpServer())
        .post("/api/subscriptions/portal")
        .set("Cookie", cookieHeader)
        .expect(201);

      expect(portal.body.url).toBe("https://billing.test/e2e-portal");

      await prisma.payment.create({
        data: {
          userId,
          courseId,
          subscriptionId: null,
          stripeInvoiceId: `in_e2e_${Date.now()}`,
          amount: 12.5,
          currency: "eur",
          status: "paid",
        },
      });

      const payments = await request(app.getHttpServer())
        .get("/api/payments/me")
        .set("Cookie", cookieHeader)
        .expect(200);

      expect(Array.isArray(payments.body)).toBe(true);
      expect(payments.body.length).toBeGreaterThanOrEqual(1);
      const row = payments.body[0];
      expect(row).toMatchObject({
        user_id: userId,
        course_id: courseId,
        currency: "eur",
        status: "paid",
      });
      expect(Number(row.amount)).toBeCloseTo(12.5, 5);
    });
  });

  const webhookSuite =
    process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_SECRET_KEY
      ? describe
      : describe.skip;

  webhookSuite("POST /api/webhooks/stripe (signed, real Stripe SDK)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let userId: string;
    let courseId: string;

    beforeAll(async () => {
      if (!process.env.DATABASE_URL) {
        throw new Error("E2E: DATABASE_URL не задано.");
      }
      app = await createE2eApp();
      prisma = app.get(PrismaService);
    });

    afterAll(async () => {
      await prisma.stripeWebhookEvent.deleteMany({
        where: { stripeEventId: { startsWith: "evt_e2e_wh_" } },
      });
      await prisma.payment.deleteMany({
        where: { stripeInvoiceId: { startsWith: "cs_e2e_wh_" } },
      });
      await prisma.userCourseAccess.deleteMany({ where: { userId } });
      if (courseId) {
        await prisma.course.deleteMany({ where: { id: courseId } });
      }
      if (userId) {
        await prisma.user.deleteMany({ where: { id: userId } });
      }
      await prisma.$disconnect();
      await app.close();
    });

    it("200 + ідемпотентність: та сама подія двічі не створює другий payment", async () => {
      const email = `wh_e2e_${Date.now()}_${Math.random().toString(36).slice(2)}@test.local`;
      const reg = await request(app.getHttpServer())
        .post("/api/auth/register")
        .send({
          email,
          password,
          role: "student",
          language: "en",
        })
        .expect(201);

      userId = reg.body.user.id;

      const course = await prisma.course.create({
        data: {
          title: "E2E Webhook Course",
          language: "en",
          isPublished: true,
          stripePriceId: "price_e2e_wh",
        },
      });
      courseId = course.id;

      const sessionId = `cs_e2e_wh_${Date.now()}`;
      const eventId = `evt_e2e_wh_${Date.now()}`;
      const event = {
        id: eventId,
        object: "event",
        type: "checkout.session.completed",
        data: {
          object: {
            id: sessionId,
            object: "checkout.session",
            customer: "cus_e2e_wh_test",
            metadata: { user_id: userId, course_id: courseId },
            mode: "payment",
            payment_status: "paid",
            amount_total: 4200,
            currency: "eur",
          },
        },
      };

      const payload = JSON.stringify(event);
      const signature = Stripe.webhooks.generateTestHeaderString({
        payload,
        secret: process.env.STRIPE_WEBHOOK_SECRET!,
      });

      const postWebhook = () =>
        request(app.getHttpServer())
          .post("/api/webhooks/stripe")
          .set("Content-Type", "application/json")
          .set("Stripe-Signature", signature)
          .send(payload);

      const first = await postWebhook().expect(201);
      expect(first.body).toEqual({ received: true });

      const payCount1 = await prisma.payment.count({
        where: { stripeInvoiceId: sessionId },
      });
      expect(payCount1).toBe(1);

      const evtCount1 = await prisma.stripeWebhookEvent.count({
        where: { stripeEventId: eventId },
      });
      expect(evtCount1).toBe(1);

      await postWebhook().expect(201);

      const payCount2 = await prisma.payment.count({
        where: { stripeInvoiceId: sessionId },
      });
      expect(payCount2).toBe(1);

      const evtCount2 = await prisma.stripeWebhookEvent.count({
        where: { stripeEventId: eventId },
      });
      expect(evtCount2).toBe(1);
    });
  });
});
