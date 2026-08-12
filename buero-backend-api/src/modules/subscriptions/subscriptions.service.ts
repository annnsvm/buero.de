import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { StripeService } from "../stripe/stripe.service";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import type { CourseAccessResponseDto } from "./dto/course-access-response.dto";

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
  ) {}

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
      const customer = await this.stripeService.createCustomer({
        email: user.email,
        metadata: { user_id: userId },
      });
      customerId = customer.id;
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

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
      // trial (активний або минулий): дозволяємо checkout — після оплати webhook оновить до purchase
    }

    const priceId = course.stripePriceId;
    if (!priceId) {
      this.logger.warn(
        `Checkout failed: course ${dto.course_id} has no stripe_price_id`,
      );
      throw new BadRequestException(
        "Курс не має налаштованої ціни. Спочатку опублікуйте курс з вказаною ціною.",
      );
    }

    const baseUrl =
      this.configService.get<string>("CORS_ORIGIN") ?? "http://localhost:5173";
    const successUrl = dto.success_url ?? `${baseUrl}/purchase/success`;
    const cancelUrl = dto.cancel_url ?? `${baseUrl}/purchase/cancel`;

    try {
      const session = await this.stripeService.createCheckoutSession({
        customerId,
        priceId,
        successUrl,
        cancelUrl,
        metadata: { course_id: dto.course_id, user_id: userId },
      });

      if (!session.url) {
        this.logger.error(
          `Stripe checkout returned session without URL for course ${dto.course_id}`,
        );
        throw new BadRequestException("Stripe did not return a checkout URL");
      }
      return { url: session.url };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Checkout failed for course ${dto.course_id}, user ${userId}: ${msg}`,
        err instanceof Error ? err.stack : undefined,
      );
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
      const session = await this.stripeService.createBillingPortalSession({
        customerId: user.stripeCustomerId,
        returnUrl,
      });

      if (!session.url) {
        this.logger.error("Stripe portal returned session without URL");
        throw new BadRequestException("Stripe did not return a portal URL");
      }
      return { url: session.url };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Portal session failed for user ${userId}: ${msg}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw err;
    }
  }
}
