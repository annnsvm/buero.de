import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { SubscriptionStatus } from "src/generated/prisma/enums";
import { UserCourseAccessType } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class WebhookService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const secret = this.configService.get<string>("STRIPE_SECRET_KEY");
    const webhookSecret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET");
    if (!secret || !webhookSecret) {
      throw new Error(
        "STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are required for WebhookService",
      );
    }
    this.stripe = new Stripe(secret);
  }

  async handleStripeWebhook(
    rawBody: Buffer | string,
    signature: string,
  ): Promise<void> {
    const secret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET");
    if (!secret) throw new BadRequestException("Webhook secret not configured");

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        secret,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid signature";
      throw new BadRequestException(message);
    }

    try {
      const existing = await this.prisma.stripeWebhookEvent.findUnique({
        where: { stripeEventId: event.id },
      });
      if (existing) {
        this.logger.debug(`Event ${event.id} already processed, skipping`);
        return;
      }
    } catch {
      // ignore
    }

    try {
      await this.prisma.stripeWebhookEvent.create({
        data: { stripeEventId: event.id },
      });
    } catch (e: any) {
      if (e?.code === "P2002") {
        this.logger.debug(`Event ${event.id} already processed (unique), skipping`);
        return;
      }
      throw e;
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await this.handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;
        case "invoice.paid":
          await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;
        case "customer.subscription.updated":
          await this.handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription,
          );
          break;
        case "customer.subscription.deleted":
          await this.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      this.logger.error(`Webhook handler failed for ${event.id}: ${err}`);
      throw err;
    }
  }

  private mapStripeStatus(
    status: Stripe.Subscription.Status,
  ): (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus] {
    const map: Record<string, (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]> = {
      active: SubscriptionStatus.active,
      past_due: SubscriptionStatus.past_due,
      canceled: SubscriptionStatus.canceled,
      incomplete: SubscriptionStatus.incomplete,
      trialing: SubscriptionStatus.trialing,
      unpaid: SubscriptionStatus.past_due,
      paused: SubscriptionStatus.canceled,
    };
    return map[status] ?? SubscriptionStatus.incomplete;
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const userId = session.metadata?.user_id;
    const courseId = session.metadata?.course_id;
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    if (!userId || !courseId || !customerId) {
      this.logger.warn(
        "checkout.session.completed missing metadata or customer",
      );
      return;
    }

    await this.prisma.user.updateMany({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });

    const sess = session as unknown as {
      mode?: string;
      payment_status?: string;
      amount_total?: number | null;
      currency?: string | null;
      subscription?: string | { id: string } | null;
    };

    if (sess.mode === "payment" && sess.payment_status === "paid") {
      await this.handleCheckoutPaymentCompleted(
        userId,
        courseId,
        session.id,
        sess.amount_total ?? 0,
        sess.currency ?? "eur",
      );
      return;
    }

    const stripeSubscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;
    if (!stripeSubscriptionId) {
      this.logger.warn(
        "checkout.session.completed subscription mode but no subscription id",
      );
      return;
    }

    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      stripeSubscriptionId,
    );
    const stripeSub = stripeSubscription as unknown as {
      status: Stripe.Subscription.Status;
      current_period_start?: number;
      current_period_end?: number;
    };
    const status = this.mapStripeStatus(stripeSub.status);
    const currentPeriodStart = stripeSub.current_period_start
      ? new Date(stripeSub.current_period_start * 1000)
      : null;
    const currentPeriodEnd = stripeSub.current_period_end
      ? new Date(stripeSub.current_period_end * 1000)
      : null;

    await this.prisma.subscription.upsert({
      where: { stripeSubscriptionId },
      create: {
        userId,
        courseId,
        stripeCustomerId: customerId,
        stripeSubscriptionId,
        status,
        currentPeriodStart,
        currentPeriodEnd,
      },
      update: {
        status,
        currentPeriodStart,
        currentPeriodEnd,
      },
    });

    const dbSubscription = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId },
    });
    if (!dbSubscription) return;

    await this.prisma.userCourseAccess.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      create: {
        userId,
        courseId,
        accessType: UserCourseAccessType.subscription,
        subscriptionId: dbSubscription.id,
      },
      update: {
        accessType: UserCourseAccessType.subscription,
        subscriptionId: dbSubscription.id,
      },
    });
  }

  private async handleCheckoutPaymentCompleted(
    userId: string,
    courseId: string,
    sessionId: string,
    amountTotal: number,
    currency: string,
  ): Promise<void> {
    const amount = amountTotal / 100;
    try {
      const payment = await this.prisma.payment.create({
        data: {
          userId,
          courseId,
          subscriptionId: null,
          stripeInvoiceId: sessionId,
          amount,
          currency,
          status: "paid",
        },
      });

      await this.prisma.userCourseAccess.upsert({
        where: {
          userId_courseId: { userId, courseId },
        },
        create: {
          userId,
          courseId,
          accessType: UserCourseAccessType.purchase,
          paymentId: payment.id,
        },
        update: {
          accessType: UserCourseAccessType.purchase,
          paymentId: payment.id,
        },
      });
    } catch (e: any) {
      if (e?.code === "P2002") {
        this.logger.debug(
          `Payment for session ${sessionId} already exists, skipping`,
        );
        return;
      }
      throw e;
    }
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    const stripeInvoiceId = invoice.id;
    const inv = invoice as unknown as {
      subscription?: string | { id: string };
      customer?: string | { id: string };
      amount_paid?: number;
      currency?: string;
      status?: string;
    };
    const subscriptionId =
      typeof inv.subscription === "string"
        ? inv.subscription
        : inv.subscription?.id;
    const customerId =
      typeof inv.customer === "string" ? inv.customer : inv.customer?.id;

    if (!customerId) return;

    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });
    if (!user) return;

    const amount = inv.amount_paid != null ? inv.amount_paid / 100 : 0;
    const currency = inv.currency ?? "eur";
    const status = inv.status ?? "paid";

    let subscriptionRecord: { id: string; courseId: string } | null = null;
    if (subscriptionId) {
      subscriptionRecord = await this.prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscriptionId },
        select: { id: true, courseId: true },
      });
    }

    try {
      await this.prisma.payment.create({
        data: {
          userId: user.id,
          courseId: subscriptionRecord?.courseId ?? null,
          subscriptionId: subscriptionRecord?.id ?? null,
          stripeInvoiceId,
          amount,
          currency,
          status,
        },
      });
    } catch (e: any) {
      if (e?.code === "P2002") {
        this.logger.debug(`Payment for invoice ${stripeInvoiceId} already exists`);
        return;
      }
      throw e;
    }

    if (subscriptionRecord) {
      await this.prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscriptionId! },
        data: { status: SubscriptionStatus.active },
      });
    }
  }

  private async handleSubscriptionUpdated(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const stripeSub = subscription as unknown as {
      id: string;
      status: Stripe.Subscription.Status;
      current_period_start?: number;
      current_period_end?: number;
    };
    const stripeSubscriptionId = stripeSub.id;
    const status = this.mapStripeStatus(stripeSub.status);
    const currentPeriodStart = stripeSub.current_period_start
      ? new Date(stripeSub.current_period_start * 1000)
      : null;
    const currentPeriodEnd = stripeSub.current_period_end
      ? new Date(stripeSub.current_period_end * 1000)
      : null;

    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId },
      data: {
        status,
        currentPeriodStart,
        currentPeriodEnd,
      },
    });
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const stripeSubscriptionId = subscription.id;
    const canceledAt = new Date();

    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId },
      data: {
        status: SubscriptionStatus.canceled,
        canceledAt,
      },
    });

    const dbSubscription = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId },
    });
    if (dbSubscription) {
      await this.prisma.userCourseAccess.updateMany({
        where: { subscriptionId: dbSubscription.id },
        data: { subscriptionId: null },
      });
    }
  }
}
