import { Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiExcludeController } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import type { Request, Response } from "express";
import { WayForPayService } from "../wayforpay/wayforpay.service";
import type { WayForPayAcceptResponse } from "../wayforpay/wayforpay.types";
import { WebhookService } from "./webhook.service";

@SkipThrottle()
@ApiExcludeController()
@Controller("webhooks")
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly wayForPay: WayForPayService,
    private readonly configService: ConfigService,
  ) {}

  /** serviceUrl: server-to-server callback WayForPay. */
  @Post("wayforpay")
  async handleWayForPay(
    @Req() req: Request,
  ): Promise<WayForPayAcceptResponse> {
    return this.webhookService.handleWayForPayCallback(req.body);
  }

  /**
   * returnUrl: сюди WayForPay повертає браузер клієнта (POST-формою),
   * далі редіректимо на сторінку результату у фронтенді.
   */
  @Post("wayforpay/return")
  handleReturnPost(@Req() req: Request, @Res() res: Response): void {
    this.redirectToFrontend(req, res);
  }

  @Get("wayforpay/return")
  handleReturnGet(@Req() req: Request, @Res() res: Response): void {
    this.redirectToFrontend(req, res);
  }

  private redirectToFrontend(req: Request, res: Response): void {
    let orderReference: string | undefined;
    let status: string | undefined;

    try {
      const payload = this.webhookService.normalizePayload(req.body);
      orderReference = payload.orderReference;
      status = payload.transactionStatus;
    } catch {
      // Тіла може не бути взагалі — тоді покладаємось на query-параметри.
    }

    orderReference ??= this.firstQueryValue(req, "orderReference");
    status ??= this.firstQueryValue(req, "transactionStatus");

    const baseUrl =
      this.configService.get<string>("CORS_ORIGIN")?.split(",")[0]?.trim() ??
      "http://localhost:5173";

    this.logger.log(
      `WayForPay return: orderReference=${orderReference ?? "-"} status=${status ?? "-"}`,
    );

    const failed =
      status !== undefined &&
      !this.wayForPay.isApproved(status) &&
      !this.wayForPay.isPendingStatus(status);
    const path = failed ? "/purchase/cancel" : "/purchase/success";
    const query = orderReference
      ? `?orderReference=${encodeURIComponent(orderReference)}`
      : "";

    res.redirect(303, `${baseUrl}${path}${query}`);
  }

  private firstQueryValue(req: Request, key: string): string | undefined {
    const value = req.query?.[key];
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    return undefined;
  }
}
