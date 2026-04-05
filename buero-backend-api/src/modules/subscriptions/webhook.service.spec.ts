import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { StripeService } from "../stripe/stripe.service";
import { WebhookService } from "./webhook.service";

describe("WebhookService", () => {
  let service: WebhookService;
  let prisma: {
    stripeWebhookEvent: { findUnique: jest.Mock; create: jest.Mock };
    user: { updateMany: jest.Mock; findFirst: jest.Mock };
    payment: { create: jest.Mock };
    userCourseAccess: { upsert: jest.Mock; updateMany: jest.Mock };
    subscription: {
      upsert: jest.Mock;
      findUnique: jest.Mock;
      updateMany: jest.Mock;
    };
  };
  let constructWebhookEvent: jest.Mock;
  let getClient: jest.Mock;
  let subscriptionsRetrieve: jest.Mock;

  beforeEach(async () => {
    subscriptionsRetrieve = jest.fn();
    getClient = jest.fn().mockReturnValue({
      subscriptions: { retrieve: subscriptionsRetrieve },
    });
    constructWebhookEvent = jest.fn();

    prisma = {
      stripeWebhookEvent: { findUnique: jest.fn(), create: jest.fn() },
      user: { updateMany: jest.fn(), findFirst: jest.fn() },
      payment: { create: jest.fn() },
      userCourseAccess: { upsert: jest.fn(), updateMany: jest.fn() },
      subscription: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        {
          provide: StripeService,
          useValue: {
            constructWebhookEvent,
            getClient,
          },
        },
      ],
    }).compile();

    service = module.get(WebhookService);
  });

  function paymentModeCheckoutEvent(
    eventId = "evt_checkout_1",
    sessionId = "cs_pay_1",
  ) {
    return {
      id: eventId,
      type: "checkout.session.completed",
      data: {
        object: {
          id: sessionId,
          object: "checkout.session",
          customer: "cus_webhook",
          metadata: { user_id: "user-a", course_id: "course-a" },
          mode: "payment",
          payment_status: "paid",
          amount_total: 5000,
          currency: "eur",
        },
      },
    };
  }

  describe("handleStripeWebhook", () => {
    it("propagates BadRequestException from constructWebhookEvent", async () => {
      constructWebhookEvent.mockImplementation(() => {
        throw new BadRequestException("Invalid signature");
      });
      await expect(
        service.handleStripeWebhook(Buffer.from("{}"), "bad"),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("is idempotent: second delivery with same event id skips handler", async () => {
      const ev = paymentModeCheckoutEvent("evt_idem_1", "cs_idem_1");
      constructWebhookEvent.mockReturnValue(ev);

      prisma.stripeWebhookEvent.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: "row-1", stripeEventId: "evt_idem_1" });
      prisma.stripeWebhookEvent.create.mockResolvedValue({});
      prisma.user.updateMany.mockResolvedValue({ count: 1 });
      prisma.payment.create.mockResolvedValue({
        id: "pay-1",
        userId: "user-a",
        courseId: "course-a",
      });
      prisma.userCourseAccess.upsert.mockResolvedValue({});

      await service.handleStripeWebhook(Buffer.from("raw1"), "sig1");
      await service.handleStripeWebhook(Buffer.from("raw2"), "sig2");

      expect(prisma.payment.create).toHaveBeenCalledTimes(1);
      expect(prisma.stripeWebhookEvent.create).toHaveBeenCalledTimes(1);
    });

    it("skips handler when stripeWebhookEvent.create hits P2002 (race)", async () => {
      const ev = paymentModeCheckoutEvent("evt_p2002", "cs_p2002");
      constructWebhookEvent.mockReturnValue(ev);
      prisma.stripeWebhookEvent.findUnique.mockResolvedValue(null);
      const dup = Object.assign(new Error("Unique"), { code: "P2002" });
      prisma.stripeWebhookEvent.create.mockRejectedValue(dup);

      await service.handleStripeWebhook(Buffer.from("x"), "sig");

      expect(prisma.user.updateMany).not.toHaveBeenCalled();
      expect(prisma.payment.create).not.toHaveBeenCalled();
    });

    it("checkout.session.completed (payment mode) creates payment and access", async () => {
      const ev = paymentModeCheckoutEvent();
      constructWebhookEvent.mockReturnValue(ev);
      prisma.stripeWebhookEvent.findUnique.mockResolvedValue(null);
      prisma.stripeWebhookEvent.create.mockResolvedValue({});
      prisma.user.updateMany.mockResolvedValue({ count: 1 });
      prisma.payment.create.mockResolvedValue({ id: "pay-new" });
      prisma.userCourseAccess.upsert.mockResolvedValue({});

      await service.handleStripeWebhook(Buffer.from("{}"), "sig");

      expect(prisma.user.updateMany).toHaveBeenCalledWith({
        where: { id: "user-a" },
        data: { stripeCustomerId: "cus_webhook" },
      });
      expect(prisma.payment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-a",
          courseId: "course-a",
          stripeInvoiceId: "cs_pay_1",
          amount: 50,
          currency: "eur",
          status: "paid",
        }),
      });
      expect(prisma.userCourseAccess.upsert).toHaveBeenCalled();
    });

    it("checkout.session.completed (subscription mode) upserts subscription and access", async () => {
      const ev = {
        id: "evt_sub_1",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_sub_1",
            object: "checkout.session",
            customer: "cus_s",
            metadata: { user_id: "u-sub", course_id: "c-sub" },
            mode: "subscription",
            payment_status: "paid",
            subscription: "sub_stripe_1",
          },
        },
      };
      constructWebhookEvent.mockReturnValue(ev);
      prisma.stripeWebhookEvent.findUnique.mockResolvedValue(null);
      prisma.stripeWebhookEvent.create.mockResolvedValue({});
      prisma.user.updateMany.mockResolvedValue({ count: 1 });
      subscriptionsRetrieve.mockResolvedValue({
        status: "active",
        current_period_start: 1700000000,
        current_period_end: 1702592000,
      });
      prisma.subscription.upsert.mockResolvedValue({});
      prisma.subscription.findUnique.mockResolvedValue({
        id: "db-sub-1",
        stripeSubscriptionId: "sub_stripe_1",
      });
      prisma.userCourseAccess.upsert.mockResolvedValue({});

      await service.handleStripeWebhook(Buffer.from("{}"), "sig");

      expect(subscriptionsRetrieve).toHaveBeenCalledWith("sub_stripe_1");
      expect(prisma.subscription.upsert).toHaveBeenCalled();
      expect(prisma.userCourseAccess.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId_courseId: { userId: "u-sub", courseId: "c-sub" } },
        }),
      );
    });

    it("invoice.paid creates payment and activates subscription when linked", async () => {
      const ev = {
        id: "evt_inv_1",
        type: "invoice.paid",
        data: {
          object: {
            id: "in_abc",
            subscription: "sub_xyz",
            customer: "cus_inv",
            amount_paid: 1999,
            currency: "eur",
            status: "paid",
          },
        },
      };
      constructWebhookEvent.mockReturnValue(ev);
      prisma.stripeWebhookEvent.findUnique.mockResolvedValue(null);
      prisma.stripeWebhookEvent.create.mockResolvedValue({});
      prisma.user.findFirst.mockResolvedValue({ id: "user-inv" });
      prisma.subscription.findUnique.mockResolvedValue({
        id: "sub-db",
        courseId: "c-inv",
      });
      prisma.payment.create.mockResolvedValue({});

      await service.handleStripeWebhook(Buffer.from("{}"), "sig");

      expect(prisma.payment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-inv",
          courseId: "c-inv",
          subscriptionId: "sub-db",
          stripeInvoiceId: "in_abc",
          amount: 19.99,
          currency: "eur",
          status: "paid",
        }),
      });
      expect(prisma.subscription.updateMany).toHaveBeenCalled();
    });

    it("customer.subscription.updated updates subscription row", async () => {
      const ev = {
        id: "evt_upd_1",
        type: "customer.subscription.updated",
        data: {
          object: {
            id: "sub_upd",
            status: "past_due",
            current_period_start: 1700000000,
            current_period_end: 1702592000,
          },
        },
      };
      constructWebhookEvent.mockReturnValue(ev);
      prisma.stripeWebhookEvent.findUnique.mockResolvedValue(null);
      prisma.stripeWebhookEvent.create.mockResolvedValue({});

      await service.handleStripeWebhook(Buffer.from("{}"), "sig");

      expect(prisma.subscription.updateMany).toHaveBeenCalledWith({
        where: { stripeSubscriptionId: "sub_upd" },
        data: expect.objectContaining({
          status: "past_due",
        }),
      });
    });

    it("customer.subscription.deleted cancels subscription and clears access link", async () => {
      const ev = {
        id: "evt_del_1",
        type: "customer.subscription.deleted",
        data: {
          object: { id: "sub_del" },
        },
      };
      constructWebhookEvent.mockReturnValue(ev);
      prisma.stripeWebhookEvent.findUnique.mockResolvedValue(null);
      prisma.stripeWebhookEvent.create.mockResolvedValue({});
      prisma.subscription.findUnique.mockResolvedValue({
        id: "db-del",
        stripeSubscriptionId: "sub_del",
      });
      prisma.userCourseAccess.updateMany.mockResolvedValue({ count: 1 });

      await service.handleStripeWebhook(Buffer.from("{}"), "sig");

      expect(prisma.subscription.updateMany).toHaveBeenCalledWith({
        where: { stripeSubscriptionId: "sub_del" },
        data: expect.objectContaining({ status: "canceled" }),
      });
      expect(prisma.userCourseAccess.updateMany).toHaveBeenCalledWith({
        where: { subscriptionId: "db-del" },
        data: { subscriptionId: null },
      });
    });

    it("ignores unhandled event types without throwing", async () => {
      const ev = {
        id: "evt_other",
        type: "charge.succeeded",
        data: { object: {} },
      };
      constructWebhookEvent.mockReturnValue(ev);
      prisma.stripeWebhookEvent.findUnique.mockResolvedValue(null);
      prisma.stripeWebhookEvent.create.mockResolvedValue({});

      await expect(
        service.handleStripeWebhook(Buffer.from("{}"), "sig"),
      ).resolves.toBeUndefined();
    });
  });
});
