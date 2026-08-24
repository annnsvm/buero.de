import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { WayForPayService } from "../wayforpay/wayforpay.service";
import { PaymentFulfillmentService } from "./payment-fulfillment.service";

describe("PaymentFulfillmentService", () => {
  let service: PaymentFulfillmentService;
  let prisma: {
    payment: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
    userCourseAccess: { upsert: jest.Mock };
  };
  let wayForPay: {
    isConfigured: jest.Mock;
    checkStatus: jest.Mock;
    isApproved: jest.Mock;
    isPendingStatus: jest.Mock;
  };

  const userId = "11111111-1111-1111-1111-111111111111";
  const courseId = "22222222-2222-2222-2222-222222222222";
  const paymentId = "33333333-3333-3333-3333-333333333333";
  const orderReference = "bd-1700000000000-abcd1234";

  beforeEach(async () => {
    prisma = {
      payment: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue({
          id: paymentId,
          userId,
          courseId,
          status: "pending",
        }),
        update: jest.fn(),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      userCourseAccess: { upsert: jest.fn() },
    };

    wayForPay = {
      isConfigured: jest.fn(() => true),
      checkStatus: jest.fn(),
      isApproved: jest.fn((status: string) => status === "Approved"),
      isPendingStatus: jest.fn((status: string) => status === "InProcessing"),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentFulfillmentService,
        {
          provide: PrismaService,
          useValue: prisma as unknown as PrismaService,
        },
        { provide: WayForPayService, useValue: wayForPay },
      ],
    }).compile();

    service = module.get(PaymentFulfillmentService);
  });

  describe("reconcilePendingForUser", () => {
    const queuePending = () =>
      prisma.payment.findMany.mockResolvedValue([{ orderReference }]);

    it("grants access when WayForPay confirms the payment after the user left", async () => {
      queuePending();
      wayForPay.checkStatus.mockResolvedValue({
        transactionStatus: "Approved",
        amount: 1,
        currency: "EUR",
      });

      await service.reconcilePendingForUser(userId);

      expect(prisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: paymentId },
          data: expect.objectContaining({ status: "paid" }),
        }),
      );
      expect(prisma.userCourseAccess.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId_courseId: { userId, courseId } },
        }),
      );
    });

    it("leaves still-processing payments untouched", async () => {
      queuePending();
      wayForPay.checkStatus.mockResolvedValue({
        transactionStatus: "InProcessing",
      });

      await service.reconcilePendingForUser(userId);

      expect(prisma.payment.update).not.toHaveBeenCalled();
      expect(prisma.payment.updateMany).not.toHaveBeenCalled();
      expect(prisma.userCourseAccess.upsert).not.toHaveBeenCalled();
    });

    it("marks declined payments as failed without granting access", async () => {
      queuePending();
      wayForPay.checkStatus.mockResolvedValue({
        transactionStatus: "Declined",
        reason: "Insufficient funds",
      });

      await service.reconcilePendingForUser(userId);

      expect(prisma.payment.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { orderReference, status: "pending" },
          data: { status: "failed" },
        }),
      );
      expect(prisma.userCourseAccess.upsert).not.toHaveBeenCalled();
    });

    it("never breaks the course list when WayForPay is unreachable", async () => {
      queuePending();
      wayForPay.checkStatus.mockRejectedValue(new Error("network down"));

      await expect(
        service.reconcilePendingForUser(userId),
      ).resolves.toBeUndefined();
    });

    it("skips the WayForPay round trip when it is not configured", async () => {
      wayForPay.isConfigured.mockReturnValue(false);

      await service.reconcilePendingForUser(userId);

      expect(prisma.payment.findMany).not.toHaveBeenCalled();
    });
  });
});
