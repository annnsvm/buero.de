import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { PaymentService } from "./payment.service";

describe("PaymentService", () => {
  let service: PaymentService;
  let findMany: jest.Mock;

  beforeEach(async () => {
    findMany = jest.fn();
    const prisma = {
      payment: { findMany },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
      ],
    }).compile();

    service = module.get(PaymentService);
  });

  describe("getMyPayments", () => {
    it("maps payments to DTO with numeric amount", async () => {
      const created = new Date("2025-03-01T12:00:00.000Z");
      findMany.mockResolvedValue([
        {
          id: "pay-1",
          userId: "user-1",
          courseId: "course-1",
          subscriptionId: null,
          provider: "wayforpay",
          orderReference: "bd-1700000000000-abcd1234",
          stripeInvoiceId: null,
          amount: 29.99,
          currency: "eur",
          status: "paid",
          createdAt: created,
        },
      ]);

      const list = await service.getMyPayments("user-1");

      expect(findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
      expect(list).toEqual([
        {
          id: "pay-1",
          user_id: "user-1",
          course_id: "course-1",
          provider: "wayforpay",
          order_reference: "bd-1700000000000-abcd1234",
          amount: 29.99,
          currency: "eur",
          status: "paid",
          created_at: created,
        },
      ]);
    });

    it("returns empty array when none", async () => {
      findMany.mockResolvedValue([]);
      expect(await service.getMyPayments("u")).toEqual([]);
    });
  });
});
