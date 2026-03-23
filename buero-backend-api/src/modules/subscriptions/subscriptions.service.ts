import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import type { CourseAccessResponseDto } from "./dto/course-access-response.dto";

@Injectable()
export class SubscriptionsService {
  private readonly stripe: Stripe;

  /** Stripe replaces `{CHECKOUT_SESSION_ID}` in the success URL after payment. */
  static appendCheckoutSessionId(successUrl: string): string {
    if (successUrl.includes("{CHECKOUT_SESSION_ID}")) {
      return successUrl;
    }
    const separator = successUrl.includes("?") ? "&" : "?";
    return `${successUrl}${separator}session_id={CHECKOUT_SESSION_ID}`;
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const secret = this.configService.get<string>("STRIPE_SECRET_KEY");
    if (!secret) {
      throw new Error("STRIPE_SECRET_KEY is required for SubscriptionsService");
    }
    this.stripe = new Stripe(secret);
  }

  async createCheckoutSession(
    userId: string,
    dto: CreateCheckoutDto,
  ): Promise<{ url: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, stripeCustomerId: true },
    });
    if (!user) throw new NotFoundException("User not found");

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      try {
        const customer = await this.stripe.customers.create({
          email: user.email,
          metadata: { user_id: userId },
        });
        customerId = customer.id;
        await this.prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });
      } catch (err) {
        if (err instanceof Stripe.errors.StripeError) {
          throw new BadRequestException(err.message);
        }
        throw err;
      }
    }

    const course = await this.prisma.course.findUnique({
      where: { id: dto.course_id },
    });
    if (!course) throw new NotFoundException("Course not found");

    const existingAccess = await this.prisma.userCourseAccess.findUnique({
      where: {
        userId_courseId: { userId, courseId: dto.course_id },
      },
    });
    if (existingAccess) {
      if (existingAccess.accessType === "purchase") {
        throw new ConflictException("You already own this course");
      }
      if (existingAccess.accessType === "subscription") {
        throw new ConflictException(
          "You already have access to this course via subscription",
        );
      }
      if (
        existingAccess.accessType === "trial" &&
        existingAccess.trialEndsAt &&
        existingAccess.trialEndsAt > new Date()
      ) {
        throw new ConflictException(
          "You already have trial access to this course",
        );
      }
    }

    const priceId = this.configService.get<string>("STRIPE_PRICE_ID");
    if (!priceId) {
      throw new BadRequestException("STRIPE_PRICE_ID is not configured (one-time price for course purchase)");
    }

    const baseUrl =
      this.configService.get<string>("CORS_ORIGIN") ?? "http://localhost:5173";
    const successUrl = SubscriptionsService.appendCheckoutSessionId(
      dto.success_url ?? `${baseUrl}/purchase/success`,
    );
    const cancelUrl = dto.cancel_url ?? `${baseUrl}/purchase/cancel`;

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: "payment",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { course_id: dto.course_id, user_id: userId },
      });

      if (!session.url) {
        throw new BadRequestException("Stripe did not return a checkout URL");
      }
      return { url: session.url };
    } catch (err) {
      if (err instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  async getMyCourseAccess(
    userId: string,
  ): Promise<CourseAccessResponseDto[]> {
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

  async createPortalSession(userId: string): Promise<{ url: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });
    if (!user) throw new NotFoundException("User not found");
    if (!user.stripeCustomerId) {
      throw new BadRequestException(
        "No Stripe customer. Complete a checkout first.",
      );
    }

    const returnUrl =
      this.configService.get<string>("STRIPE_PORTAL_RETURN_URL") ??
      this.configService.get<string>("CORS_ORIGIN") ??
      "http://localhost:5173";

    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: returnUrl,
      });

      if (!session.url) {
        throw new BadRequestException("Stripe did not return a portal URL");
      }
      return { url: session.url };
    } catch (err) {
      if (err instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
}
