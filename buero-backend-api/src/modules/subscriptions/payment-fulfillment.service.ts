import { Injectable, Logger } from "@nestjs/common";
import { UserCourseAccessType } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { WayForPayService } from "../wayforpay/wayforpay.service";

export const PAYMENT_STATUS = {
  pending: "pending",
  paid: "paid",
  failed: "failed",
  refunded: "refunded",
} as const;

/** Скільки часу після створення платежу ще має сенс перепитувати WayForPay. */
const PENDING_RECONCILE_WINDOW_MS = 24 * 60 * 60 * 1000;
const PENDING_RECONCILE_LIMIT = 5;

/**
 * Спільна логіка нарахування доступу після оплати.
 * Використовується і webhook-ом WayForPay, і ручною синхронізацією (sync-checkout).
 */
@Injectable()
export class PaymentFulfillmentService {
  private readonly logger = new Logger(PaymentFulfillmentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wayForPay: WayForPayService,
  ) {}

  /**
   * Догортає платежі, які WayForPay підтвердив уже після того, як студент пішов
   * зі сторінки успіху (callback міг не дійти — напр. на локальному оточенні).
   * Ніколи не кидає помилку: список курсів має відкриватись і без WayForPay.
   */
  async reconcilePendingForUser(userId: string): Promise<void> {
    if (!this.wayForPay.isConfigured()) return;

    try {
      const pending = await this.prisma.payment.findMany({
        where: {
          userId,
          provider: "wayforpay",
          status: PAYMENT_STATUS.pending,
          orderReference: { not: null },
          createdAt: {
            gte: new Date(Date.now() - PENDING_RECONCILE_WINDOW_MS),
          },
        },
        select: { orderReference: true },
        orderBy: { createdAt: "desc" },
        take: PENDING_RECONCILE_LIMIT,
      });

      for (const { orderReference } of pending) {
        if (!orderReference) continue;

        const result = await this.wayForPay.checkStatus(orderReference);

        if (this.wayForPay.isApproved(result.transactionStatus)) {
          await this.markPaid({
            orderReference,
            amount: result.amount != null ? Number(result.amount) : undefined,
            currency: result.currency,
          });
        } else if (!this.wayForPay.isPendingStatus(result.transactionStatus)) {
          await this.markFailed(orderReference, result.reason);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `Failed to reconcile pending payments for user ${userId}: ${msg}`,
      );
    }
  }

  /**
   * Позначає платіж оплаченим і відкриває доступ до курсу.
   * Ідемпотентна: повторний виклик для вже оплаченого платежу лише гарантує наявність доступу.
   */
  async markPaid(params: {
    orderReference: string;
    amount?: number;
    currency?: string;
  }): Promise<{ granted: boolean }> {
    const payment = await this.prisma.payment.findUnique({
      where: { orderReference: params.orderReference },
    });

    if (!payment) {
      this.logger.warn(
        `Payment for order ${params.orderReference} not found, nothing to fulfil`,
      );
      return { granted: false };
    }

    if (payment.status !== PAYMENT_STATUS.paid) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PAYMENT_STATUS.paid,
          ...(params.amount != null && { amount: params.amount }),
          ...(params.currency && { currency: params.currency.toLowerCase() }),
        },
      });
    }

    if (!payment.courseId) {
      this.logger.warn(
        `Payment ${payment.id} has no course, access not granted`,
      );
      return { granted: false };
    }

    await this.prisma.userCourseAccess.upsert({
      where: {
        userId_courseId: {
          userId: payment.userId,
          courseId: payment.courseId,
        },
      },
      create: {
        userId: payment.userId,
        courseId: payment.courseId,
        accessType: UserCourseAccessType.purchase,
        paymentId: payment.id,
      },
      update: {
        accessType: UserCourseAccessType.purchase,
        paymentId: payment.id,
        trialEndsAt: null,
      },
    });

    this.logger.log(
      `Course ${payment.courseId} unlocked for user ${payment.userId} (order ${params.orderReference})`,
    );
    return { granted: true };
  }

  /** Фіксує неуспішний платіж; доступ не змінюється. */
  async markFailed(orderReference: string, reason?: string): Promise<void> {
    const updated = await this.prisma.payment.updateMany({
      where: { orderReference, status: PAYMENT_STATUS.pending },
      data: { status: PAYMENT_STATUS.failed },
    });

    if (updated.count > 0) {
      this.logger.log(
        `Payment ${orderReference} marked as failed${reason ? `: ${reason}` : ""}`,
      );
    }
  }
}
