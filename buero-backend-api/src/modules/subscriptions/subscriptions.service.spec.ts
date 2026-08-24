import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { WayForPayService } from "../wayforpay/wayforpay.service";
import { PaymentFulfillmentService } from "./payment-fulfillment.service";
import { SubscriptionsService } from "./subscriptions.service";

describe("SubscriptionsService", () => {
  let service: SubscriptionsService;
  let prisma: {
    user: { findUnique: jest.Mock };
    course: { findUnique: jest.Mock };
    courseMaterial: { count: jest.Mock };
    userCourseAccess: { findUnique: jest.Mock; findMany: jest.Mock };
    payment: { create: jest.Mock; delete: jest.Mock; findUnique: jest.Mock };
  };
  let wayForPay: {
    getDefaultCurrency: jest.Mock;
    generateOrderReference: jest.Mock;
    createPaymentPageUrl: jest.Mock;
    getReturnUrl: jest.Mock;
    getServiceUrl: jest.Mock;
    checkStatus: jest.Mock;
    isApproved: jest.Mock;
    isPendingStatus: jest.Mock;
  };
  let fulfillment: {
    markPaid: jest.Mock;
    markFailed: jest.Mock;
    reconcilePendingForUser: jest.Mock;
  };

  const userId = "11111111-1111-1111-1111-111111111111";
  const courseId = "22222222-2222-2222-2222-222222222222";
  const orderReference = "bd-1700000000000-abcd1234";
  const dto = { course_id: courseId };

  /** Щасливий шлях: користувач, опублікований курс з ціною, доступу ще немає. */
  const arrangeCheckoutHappyPath = () => {
    prisma.user.findUnique.mockResolvedValue({
      id: userId,
      email: "u@test.com",
    });
    prisma.course.findUnique.mockResolvedValue({
      id: courseId,
      title: "German A1",
      isPublished: true,
      price: 69,
    });
    prisma.courseMaterial.count.mockResolvedValue(3);
    prisma.userCourseAccess.findUnique.mockResolvedValue(null);
    prisma.payment.create.mockResolvedValue({ id: "pay-1" });
    wayForPay.createPaymentPageUrl.mockResolvedValue(
      "https://secure.wayforpay.com/page?vkh=abc",
    );
  };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn() },
      course: { findUnique: jest.fn() },
      courseMaterial: { count: jest.fn() },
      userCourseAccess: { findUnique: jest.fn(), findMany: jest.fn() },
      payment: {
        create: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    wayForPay = {
      getDefaultCurrency: jest.fn().mockReturnValue("EUR"),
      generateOrderReference: jest.fn().mockReturnValue(orderReference),
      createPaymentPageUrl: jest.fn(),
      getReturnUrl: jest
        .fn()
        .mockReturnValue("http://localhost:3000/api/webhooks/wayforpay/return"),
      getServiceUrl: jest
        .fn()
        .mockReturnValue("http://localhost:3000/api/webhooks/wayforpay"),
      checkStatus: jest.fn(),
      isApproved: jest.fn((status: string) => status === "Approved"),
      isPendingStatus: jest.fn((status: string) => status === "InProcessing"),
    };

    fulfillment = {
      markPaid: jest.fn(),
      markFailed: jest.fn(),
      reconcilePendingForUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: PrismaService,
          useValue: prisma as unknown as PrismaService,
        },
        { provide: WayForPayService, useValue: wayForPay },
        { provide: PaymentFulfillmentService, useValue: fulfillment },
      ],
    }).compile();

    service = module.get(SubscriptionsService);
  });

  describe("createCheckoutSession", () => {
    it("creates a pending payment and returns the WayForPay page url", async () => {
      arrangeCheckoutHappyPath();

      const result = await service.createCheckoutSession(userId, dto);

      expect(result).toEqual({
        url: "https://secure.wayforpay.com/page?vkh=abc",
        order_reference: orderReference,
      });
      expect(prisma.payment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
          courseId,
          provider: "wayforpay",
          orderReference,
          amount: 69,
          currency: "eur",
          status: "pending",
        }),
      });
      expect(wayForPay.createPaymentPageUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          orderReference,
          amount: 69,
          currency: "EUR",
          productName: "German A1",
          clientEmail: "u@test.com",
          clientAccountId: userId,
        }),
      );
    });

    it("removes the pending payment when WayForPay rejects the request", async () => {
      arrangeCheckoutHappyPath();
      wayForPay.createPaymentPageUrl.mockRejectedValue(
        new BadRequestException("merchant not found"),
      );

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.payment.delete).toHaveBeenCalledWith({
        where: { id: "pay-1" },
      });
    });

    it("throws NotFoundException when user missing", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("throws NotFoundException when course missing", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: userId, email: "u@t.com" });
      prisma.course.findUnique.mockResolvedValue(null);

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("rejects an unpublished course", async () => {
      arrangeCheckoutHappyPath();
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        title: "Draft",
        isPublished: false,
        price: 69,
      });

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("rejects a course without lessons", async () => {
      arrangeCheckoutHappyPath();
      prisma.courseMaterial.count.mockResolvedValue(0);

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("rejects a course without a price", async () => {
      arrangeCheckoutHappyPath();
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        title: "Free",
        isPublished: true,
        price: null,
      });

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("throws ConflictException when purchase access exists", async () => {
      arrangeCheckoutHappyPath();
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "purchase",
      });

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("allows checkout during an active trial (upgrade to purchase)", async () => {
      arrangeCheckoutHappyPath();
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date(Date.now() + 86_400_000),
      });

      const result = await service.createCheckoutSession(userId, dto);

      expect(result.url).toBe("https://secure.wayforpay.com/page?vkh=abc");
    });
  });

  describe("syncCheckout", () => {
    const syncDto = { order_reference: orderReference };

    it("throws NotFoundException for another user's payment", async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: "pay-1",
        userId: "someone-else",
        status: "pending",
      });

      await expect(
        service.syncCheckout(userId, syncDto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("grants access when WayForPay reports Approved", async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: "pay-1",
        userId,
        status: "pending",
      });
      wayForPay.checkStatus.mockResolvedValue({
        transactionStatus: "Approved",
        amount: 69,
        currency: "EUR",
      });

      const result = await service.syncCheckout(userId, syncDto);

      expect(result).toEqual({ ok: true, status: "paid" });
      expect(fulfillment.markPaid).toHaveBeenCalledWith({
        orderReference,
        amount: 69,
        currency: "EUR",
      });
    });

    it("stays pending while the transaction is still processing", async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: "pay-1",
        userId,
        status: "pending",
      });
      wayForPay.checkStatus.mockResolvedValue({
        transactionStatus: "InProcessing",
      });

      const result = await service.syncCheckout(userId, syncDto);

      expect(result).toEqual({ ok: false, status: "pending" });
      expect(fulfillment.markPaid).not.toHaveBeenCalled();
      expect(fulfillment.markFailed).not.toHaveBeenCalled();
    });

    it("marks the payment failed when declined", async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: "pay-1",
        userId,
        status: "pending",
      });
      wayForPay.checkStatus.mockResolvedValue({
        transactionStatus: "Declined",
        reason: "Insufficient funds",
      });

      const result = await service.syncCheckout(userId, syncDto);

      expect(result).toEqual({ ok: false, status: "failed" });
      expect(fulfillment.markFailed).toHaveBeenCalledWith(
        orderReference,
        "Insufficient funds",
      );
    });

    it("skips CHECK_STATUS when the payment is already paid", async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: "pay-1",
        userId,
        status: "paid",
      });

      const result = await service.syncCheckout(userId, syncDto);

      expect(result).toEqual({ ok: true, status: "paid" });
      expect(wayForPay.checkStatus).not.toHaveBeenCalled();
      expect(fulfillment.markPaid).toHaveBeenCalledWith({ orderReference });
    });
  });

  describe("getMyCourseAccess (subscriptions/me)", () => {
    it("maps prisma rows to DTO shape", async () => {
      const created = new Date("2025-01-01T00:00:00.000Z");
      prisma.userCourseAccess.findMany.mockResolvedValue([
        {
          id: "acc-1",
          courseId,
          accessType: "trial",
          trialEndsAt: new Date("2025-02-01"),
          paymentId: null,
          subscriptionId: null,
          createdAt: created,
        },
      ]);

      const list = await service.getMyCourseAccess(userId);

      expect(list).toEqual([
        {
          id: "acc-1",
          course_id: courseId,
          access_type: "trial",
          trial_ends_at: new Date("2025-02-01"),
          created_at: created,
        },
      ]);
    });
  });
});
