import { INestApplication } from "@nestjs/common";
import { createHmac } from "crypto";
import request from "supertest";
import { PrismaService } from "src/prisma/prisma.service";
import { createE2eApp } from "./e2e-app.factory";
import { registerVerified } from "./helpers/register-verified";

function getSetCookieHeaders(headers: {
  "set-cookie"?: string | string[];
}): string[] {
  const raw = headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

describe("Subscriptions & Billing (e2e, WayForPay)", () => {
  const password = "E2ePass123";
  const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT ?? "";
  const merchantSecret = process.env.WAYFORPAY_MERCHANT_SECRET ?? "";

  const suite = merchantSecret ? describe : describe.skip;

  suite("checkout → serviceUrl callback → access", () => {
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
        wayForPayMock: {
          createPaymentPageUrl: jest
            .fn()
            .mockResolvedValue("https://secure.wayforpay.com/page?vkh=e2e"),
        },
      });
      prisma = app.get(PrismaService);
    });

    afterAll(async () => {
      if (userId) {
        await prisma.userCourseAccess.deleteMany({ where: { userId } });
        await prisma.payment.deleteMany({ where: { userId } });
        await prisma.user.deleteMany({ where: { id: userId } });
      }
      if (courseId) {
        await prisma.course.deleteMany({ where: { id: courseId } });
      }
      await prisma.paymentWebhookEvent.deleteMany({
        where: { eventKey: { startsWith: "bd-" } },
      });
      await prisma.$disconnect();
      await app.close();
    });

    it("creates a pending payment, unlocks the course on callback and stays idempotent", async () => {
      const email = `sub_e2e_${Date.now()}_${Math.random().toString(36).slice(2)}@test.local`;
      const reg = await registerVerified(app, {
        email,
        password,
        role: "student",
        language: "en",
      });

      userId = reg.body.user.id;
      cookieHeader = getSetCookieHeaders(reg.headers)
        .map((c) => c.split(";")[0])
        .join("; ");

      const course = await prisma.course.create({
        data: {
          title: "E2E Subscriptions",
          language: "en",
          isPublished: true,
          price: 12.5,
          modules: {
            create: {
              title: "Module 1",
              orderIndex: 0,
              materials: {
                create: {
                  type: "text",
                  title: "Lesson 1",
                  content: { body: "hello" },
                  orderIndex: 0,
                },
              },
            },
          },
        },
      });
      courseId = course.id;

      const checkout = await request(app.getHttpServer())
        .post("/api/subscriptions/checkout")
        .set("Cookie", cookieHeader)
        .send({ course_id: courseId })
        .expect(201);

      expect(checkout.body.url).toBe("https://secure.wayforpay.com/page?vkh=e2e");
      const orderReference: string = checkout.body.order_reference;
      expect(orderReference).toEqual(expect.stringContaining("bd-"));

      const pending = await prisma.payment.findUnique({
        where: { orderReference },
      });
      expect(pending?.status).toBe("pending");

      const callback = {
        merchantAccount,
        orderReference,
        amount: 12.5,
        currency: "EUR",
        authCode: "12345",
        cardPan: "44**44",
        transactionStatus: "Approved",
        reasonCode: 1100,
      };
      const merchantSignature = createHmac("md5", merchantSecret)
        .update(
          [
            callback.merchantAccount,
            callback.orderReference,
            String(callback.amount),
            callback.currency,
            callback.authCode,
            callback.cardPan,
            callback.transactionStatus,
            String(callback.reasonCode),
          ].join(";"),
          "utf8",
        )
        .digest("hex");

      const postCallback = () =>
        request(app.getHttpServer())
          .post("/api/webhooks/wayforpay")
          .send({ ...callback, merchantSignature });

      const first = await postCallback().expect(201);
      expect(first.body).toMatchObject({ orderReference, status: "accept" });
      expect(first.body.signature).toEqual(expect.any(String));

      const paid = await prisma.payment.findUnique({
        where: { orderReference },
      });
      expect(paid?.status).toBe("paid");

      const access = await prisma.userCourseAccess.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });
      expect(access?.accessType).toBe("purchase");

      await postCallback().expect(201);

      const events = await prisma.paymentWebhookEvent.count({
        where: { eventKey: { startsWith: orderReference } },
      });
      expect(events).toBe(1);
      const paymentsForOrder = await prisma.payment.count({
        where: { orderReference },
      });
      expect(paymentsForOrder).toBe(1);
    });

    it("rejects a callback with a broken signature", async () => {
      await request(app.getHttpServer())
        .post("/api/webhooks/wayforpay")
        .send({
          merchantAccount,
          orderReference: "bd-does-not-exist",
          amount: 1,
          currency: "EUR",
          transactionStatus: "Approved",
          reasonCode: 1100,
          merchantSignature: "deadbeef",
        })
        .expect(400);
    });

    it("returns the payment history with provider metadata", async () => {
      const payments = await request(app.getHttpServer())
        .get("/api/payments/me")
        .set("Cookie", cookieHeader)
        .expect(200);

      expect(payments.body.length).toBeGreaterThanOrEqual(1);
      expect(payments.body[0]).toMatchObject({
        user_id: userId,
        course_id: courseId,
        provider: "wayforpay",
        currency: "eur",
        status: "paid",
      });
    });

    it("redirects the browser from returnUrl to the frontend", async () => {
      const redirect = await request(app.getHttpServer())
        .post("/api/webhooks/wayforpay/return")
        .send({ orderReference: "bd-return-test", transactionStatus: "Approved" })
        .expect(303);

      expect(redirect.headers.location).toContain("/purchase/success");
      expect(redirect.headers.location).toContain("bd-return-test");
    });
  });
});
