import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CourseAccessResponseDto } from "./dto/course-access-response.dto";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import { SyncCheckoutDto } from "./dto/sync-checkout.dto";
import { SubscriptionsService } from "./subscriptions.service";

@ApiTags("subscriptions")
@Controller("subscriptions")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access_token")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post("checkout")
  @ApiOperation({
    summary: "Створити оплату курсу (WayForPay)",
    description:
      "Створює платіжну сторінку WayForPay для разової оплати курсу та pending-платіж з orderReference. Повертає URL для редіректу на оплату.",
  })
  @ApiBody({ type: CreateCheckoutDto })
  @ApiResponse({
    status: 200,
    description: "URL для редіректу та orderReference",
    schema: {
      type: "object",
      properties: {
        url: { type: "string" },
        order_reference: { type: "string" },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Курс не опублікований, без уроків, без ціни або помилка WayForPay",
  })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 404, description: "User або курс не знайдено" })
  @ApiResponse({
    status: 409,
    description:
      "Вже є повний доступ до курсу (купівля або підписка). Trial не блокує покупку",
  })
  async createCheckoutSession(
    @CurrentUser("id") userId: string,
    @Body() body: CreateCheckoutDto,
  ): Promise<{ url: string; order_reference: string }> {
    return this.subscriptionsService.createCheckoutSession(userId, body);
  }

  @Post("sync-checkout")
  @ApiOperation({
    summary: "Синхронізувати статус оплати",
    description:
      "Запитує CHECK_STATUS у WayForPay і відкриває доступ, якщо оплата пройшла. Потрібно, коли студент повернувся на сайт раніше за serviceUrl-callback.",
  })
  @ApiBody({ type: SyncCheckoutDto })
  @ApiResponse({
    status: 200,
    description: "Результат синхронізації",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean" },
        status: { type: "string", example: "paid" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 404, description: "Платіж не знайдено" })
  async syncCheckout(
    @CurrentUser("id") userId: string,
    @Body() body: SyncCheckoutDto,
  ): Promise<{ ok: boolean; status: string }> {
    return this.subscriptionsService.syncCheckout(userId, body);
  }

  @Get("me")
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
    @CurrentUser("id") userId: string,
  ): Promise<CourseAccessResponseDto[]> {
    return this.subscriptionsService.getMyCourseAccess(userId);
  }
}
