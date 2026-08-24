import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { WayForPayService } from "../wayforpay/wayforpay.service";
import type { CourseAccessResponseDto } from "./dto/course-access-response.dto";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import { SyncCheckoutDto } from "./dto/sync-checkout.dto";
import {
  PAYMENT_STATUS,
  PaymentFulfillmentService,
} from "./payment-fulfillment.service";

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wayForPay: WayForPayService,
    private readonly fulfillment: PaymentFulfillmentService,
  ) {}

  async createCheckoutSession(
    userId: string,
    dto: CreateCheckoutDto,
  ): Promise<{ url: string; order_reference: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    if (!user) throw new NotFoundException("User not found");

    const course = await this.prisma.course.findUnique({
      where: { id: dto.course_id },
    });
    if (!course) throw new NotFoundException("Course not found");
    if (course.isPublished !== true) {
      throw new BadRequestException("Course is not published");
    }

    const materialsCount = await this.prisma.courseMaterial.count({
      where: { module: { courseId: dto.course_id } },
    });
    if (materialsCount < 1) {
      throw new BadRequestException(
        "Course is not available for purchase yet",
      );
    }

    const existingAccess = await this.prisma.userCourseAccess.findUnique({
      where: { userId_courseId: { userId, courseId: dto.course_id } },
    });
    if (existingAccess?.accessType === "purchase") {
      throw new ConflictException("You already own this course");
    }
    if (existingAccess?.accessType === "subscription") {
      throw new ConflictException(
        "You already have access to this course via subscription",
      );
    }
    // trial (активний або минулий) не блокує купівлю — після оплати доступ стане purchase

    const price = course.price != null ? Number(course.price) : null;
    if (price == null || !Number.isFinite(price) || price <= 0) {
      this.logger.warn(`Checkout failed: course ${dto.course_id} has no price`);
      throw new BadRequestException(
        "Курс не має налаштованої ціни. Вкажіть ціну курсу перед публікацією.",
      );
    }

    const currency = this.wayForPay.getDefaultCurrency();
    const orderReference = this.wayForPay.generateOrderReference();

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        courseId: dto.course_id,
        provider: "wayforpay",
        orderReference,
        amount: price,
        currency: currency.toLowerCase(),
        status: PAYMENT_STATUS.pending,
      },
    });

    try {
      const url = await this.wayForPay.createPaymentPageUrl({
        orderReference,
        orderDate: Math.floor(Date.now() / 1000),
        amount: price,
        currency,
        productName: course.title,
        productPrice: price,
        productCount: 1,
        returnUrl: this.wayForPay.getReturnUrl(),
        serviceUrl: this.wayForPay.getServiceUrl(),
        clientEmail: user.email,
        clientAccountId: userId,
      });

      return { url, order_reference: orderReference };
    } catch (err) {
      // Платіжна сторінка не створилась — pending-запис лише заважатиме наступній спробі
      await this.prisma.payment.delete({ where: { id: payment.id } });
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Checkout failed for course ${dto.course_id}, user ${userId}: ${msg}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw err;
    }
  }

  /**
   * Запасний шлях, коли студент повернувся раніше за callback:
   * питаємо статус у WayForPay і за потреби відкриваємо доступ.
   */
  async syncCheckout(
    userId: string,
    dto: SyncCheckoutDto,
  ): Promise<{ ok: boolean; status: string }> {
    const payment = await this.prisma.payment.findUnique({
      where: { orderReference: dto.order_reference },
      select: { id: true, userId: true, status: true },
    });
    if (!payment || payment.userId !== userId) {
      throw new NotFoundException("Payment not found");
    }

    if (payment.status === PAYMENT_STATUS.paid) {
      await this.fulfillment.markPaid({ orderReference: dto.order_reference });
      return { ok: true, status: PAYMENT_STATUS.paid };
    }

    const result = await this.wayForPay.checkStatus(dto.order_reference);

    if (this.wayForPay.isApproved(result.transactionStatus)) {
      await this.fulfillment.markPaid({
        orderReference: dto.order_reference,
        amount: result.amount != null ? Number(result.amount) : undefined,
        currency: result.currency,
      });
      return { ok: true, status: PAYMENT_STATUS.paid };
    }

    if (this.wayForPay.isPendingStatus(result.transactionStatus)) {
      return { ok: false, status: PAYMENT_STATUS.pending };
    }

    await this.fulfillment.markFailed(dto.order_reference, result.reason);
    return { ok: false, status: PAYMENT_STATUS.failed };
  }

  async getMyCourseAccess(
    userId: string,
  ): Promise<CourseAccessResponseDto[]> {
    await this.fulfillment.reconcilePendingForUser(userId);

    const list = await this.prisma.userCourseAccess.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return list.map((a) => ({
      id: a.id,
      course_id: a.courseId,
      access_type: a.accessType,
      trial_ends_at: a.trialEndsAt ?? undefined,
      payment_id: a.paymentId ?? undefined,
      subscription_id: a.subscriptionId ?? undefined,
      created_at: a.createdAt,
    }));
  }
}
