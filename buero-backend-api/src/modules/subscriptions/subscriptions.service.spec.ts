import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { StripeService } from "../stripe/stripe.service";
import { SubscriptionsService } from "./subscriptions.service";

describe("SubscriptionsService", () => {
  let service: SubscriptionsService;
  let prisma: {
    user: { findUnique: jest.Mock; update: jest.Mock };
    course: { findUnique: jest.Mock };
    userCourseAccess: { findUnique: jest.Mock; findMany: jest.Mock };
  };
  let stripeService: {
    createCustomer: jest.Mock;
    createCheckoutSession: jest.Mock;
    createBillingPortalSession: jest.Mock;
  };
  let configGet: jest.Mock;

  const userId = "11111111-1111-1111-1111-111111111111";
  const courseId = "22222222-2222-2222-2222-222222222222";

  beforeEach(async () => {
    configGet = jest.fn((key: string) => {
      if (key === "CORS_ORIGIN") return "http://localhost:5173";
      if (key === "STRIPE_PORTAL_RETURN_URL") return "http://localhost:5173/billing";
      return undefined;
    });

    prisma = {
      user: { findUnique: jest.fn(), update: jest.fn() },
      course: { findUnique: jest.fn() },
      userCourseAccess: { findUnique: jest.fn(), findMany: jest.fn() },
    };

    stripeService = {
      createCustomer: jest.fn(),
      createCheckoutSession: jest.fn(),
      createBillingPortalSession: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: ConfigService, useValue: { get: configGet } },
        { provide: StripeService, useValue: stripeService },
      ],
    }).compile();

    service = module.get(SubscriptionsService);
  });

  describe("createCheckoutSession", () => {
    const dto = { course_id: courseId };

    it("throws NotFoundException when user missing", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("creates Stripe customer when user has no stripeCustomerId", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "u@test.com",
        stripeCustomerId: null,
      });
      stripeService.createCustomer.mockResolvedValue({ id: "cus_new" });
      prisma.user.update.mockResolvedValue({});
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        stripePriceId: "price_1",
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue(null);
      stripeService.createCheckoutSession.mockResolvedValue({
        url: "https://checkout.test/session",
      });

      const result = await service.createCheckoutSession(userId, dto);

      expect(stripeService.createCustomer).toHaveBeenCalledWith({
        email: "u@test.com",
        metadata: { user_id: userId },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { stripeCustomerId: "cus_new" },
      });
      expect(result).toEqual({ url: "https://checkout.test/session" });
      expect(stripeService.createCheckoutSession).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: "cus_new",
          priceId: "price_1",
          metadata: { course_id: courseId, user_id: userId },
        }),
      );
    });

    it("reuses existing stripeCustomerId", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "u@test.com",
        stripeCustomerId: "cus_existing",
      });
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        stripePriceId: "price_1",
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue(null);
      stripeService.createCheckoutSession.mockResolvedValue({
        url: "https://checkout.test/s",
      });

      await service.createCheckoutSession(userId, dto);

      expect(stripeService.createCustomer).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(stripeService.createCheckoutSession).toHaveBeenCalledWith(
        expect.objectContaining({ customerId: "cus_existing" }),
      );
    });

    it("throws NotFoundException when course missing", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "u@test.com",
        stripeCustomerId: "cus_x",
      });
      prisma.course.findUnique.mockResolvedValue(null);

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("throws ConflictException when purchase access exists", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "u@test.com",
        stripeCustomerId: "cus_x",
      });
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        stripePriceId: "price_1",
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "purchase",
      });

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("throws ConflictException when active trial exists", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "u@test.com",
        stripeCustomerId: "cus_x",
      });
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        stripePriceId: "price_1",
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date(Date.now() + 86400000),
      });

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("throws BadRequestException when course has no stripePriceId", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "u@test.com",
        stripeCustomerId: "cus_x",
      });
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        stripePriceId: null,
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue(null);

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("throws BadRequestException when Stripe returns session without url", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "u@test.com",
        stripeCustomerId: "cus_x",
      });
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        stripePriceId: "price_1",
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue(null);
      stripeService.createCheckoutSession.mockResolvedValue({ url: null });

      await expect(
        service.createCheckoutSession(userId, dto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe("getMyCourseAccess (subscriptions/me)", () => {
    it("maps prisma rows to DTO shape", async () => {
      const created = new Date("2025-01-01T00:00:00.000Z");
      prisma.userCourseAccess.findMany.mockResolvedValue([
        {
          id: "acc-1",
          courseId: courseId,
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

  describe("createPortalSession", () => {
    it("throws NotFoundException when user missing", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.createPortalSession(userId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("throws BadRequestException when no stripeCustomerId", async () => {
      prisma.user.findUnique.mockResolvedValue({ stripeCustomerId: null });
      await expect(service.createPortalSession(userId)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it("returns portal url from Stripe", async () => {
      prisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: "cus_portal",
      });
      stripeService.createBillingPortalSession.mockResolvedValue({
        url: "https://billing.test/portal",
      });

      const result = await service.createPortalSession(userId);

      expect(result).toEqual({ url: "https://billing.test/portal" });
      expect(stripeService.createBillingPortalSession).toHaveBeenCalledWith({
        customerId: "cus_portal",
        returnUrl: "http://localhost:5173/billing",
      });
    });

    it("throws BadRequestException when portal session has no url", async () => {
      prisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: "cus_portal",
      });
      stripeService.createBillingPortalSession.mockResolvedValue({ url: null });

      await expect(service.createPortalSession(userId)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
