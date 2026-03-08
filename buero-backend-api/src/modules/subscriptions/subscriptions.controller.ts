import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CourseAccessResponseDto } from "./dto/course-access-response.dto";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import { SubscriptionsService } from "./subscriptions.service";

@ApiTags("subscriptions")
@Controller("subscriptions")
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post("checkout")
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Створити Checkout Session (купівля курсу)",
    description:
      "Створює Stripe Checkout Session для одноразової оплати курсу. Повертає URL для редіректу на оплату. Якщо у user немає stripe_customer_id — створюється Stripe Customer. STRIPE_PRICE_ID має бути one-time ціною.",
  })
  @ApiBody({ type: CreateCheckoutDto })
  @ApiResponse({ status: 200, description: "URL для редіректу", schema: { type: "object", properties: { url: { type: "string" } } } })
  @ApiResponse({ status: 400, description: "Невалідні дані або помилка Stripe" })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 404, description: "User або курс не знайдено" })
  @ApiResponse({
    status: 409,
    description:
      "Вже є доступ до курсу (купівля, підписка або активний trial)",
  })
  async createCheckoutSession(
    @Req() req: Request,
    @Body() body: CreateCheckoutDto,
  ): Promise<{ url: string }> {
    return this.subscriptionsService.createCheckoutSession(req.user!.id, body);
  }

  @Get("me")
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Мої курси (доступ)",
    description:
      "Список курсів, до яких є доступ: trial, purchase (разова купівля), subscription. Поля course_id, access_type, trial_ends_at, payment_id, subscription_id.",
  })
  @ApiResponse({
    status: 200,
    description: "Масив доступів до курсів",
    type: [CourseAccessResponseDto],
  })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  async getMyCourseAccess(
    @Req() req: Request,
  ): Promise<CourseAccessResponseDto[]> {
    return this.subscriptionsService.getMyCourseAccess(req.user!.id);
  }

  @Post("portal")
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Stripe Customer Portal",
    description:
      "Генерує URL Stripe Customer Portal (історія платежів, способи оплати). Потрібен stripe_customer_id (після хоча б одного checkout).",
  })
  @ApiResponse({ status: 200, description: "URL для редіректу", schema: { type: "object", properties: { url: { type: "string" } } } })
  @ApiResponse({ status: 400, description: "Немає Stripe customer (спочатку здійсніть покупку)" })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 404, description: "User не знайдено" })
  async createPortalSession(@Req() req: Request): Promise<{ url: string }> {
    return this.subscriptionsService.createPortalSession(req.user!.id);
  }
}
