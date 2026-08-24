import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { WayForPayService } from "../wayforpay/wayforpay.service";
import {
  WAYFORPAY_STATUS,
  type WayForPayAcceptResponse,
  type WayForPayServiceUrlPayload,
} from "../wayforpay/wayforpay.types";
import { PaymentFulfillmentService } from "./payment-fulfillment.service";

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wayForPay: WayForPayService,
    private readonly fulfillment: PaymentFulfillmentService,
  ) {}

  /**
   * WayForPay надсилає callback то як JSON, то як form-urlencoded, то як text/plain,
   * тому тіло доводиться нормалізувати перед перевіркою підпису.
   */
  normalizePayload(body: unknown): WayForPayServiceUrlPayload {
    if (typeof body === "string") {
      return this.parseJson(body);
    }

    if (body && typeof body === "object") {
      const record = body as Record<string, unknown>;
      const keys = Object.keys(record);
      // form-urlencoded з JSON-рядком у ключі: { '{"orderReference":...}': '' }
      if (keys.length === 1 && keys[0].trim().startsWith("{")) {
        return this.parseJson(keys[0]);
      }
      return record as WayForPayServiceUrlPayload;
    }

    throw new BadRequestException("Empty WayForPay callback body");
  }

  private parseJson(raw: string): WayForPayServiceUrlPayload {
    try {
      return JSON.parse(raw) as WayForPayServiceUrlPayload;
    } catch {
      throw new BadRequestException("Malformed WayForPay callback body");
    }
  }

  /**
   * Обробляє serviceUrl-callback і повертає підписану відповідь.
   * Без такої відповіді WayForPay повторює запит протягом кількох діб.
   */
  async handleWayForPayCallback(body: unknown): Promise<WayForPayAcceptResponse> {
    const payload = this.normalizePayload(body);
    const orderReference = payload.orderReference;

    if (!orderReference) {
      throw new BadRequestException("WayForPay callback without orderReference");
    }

    if (!this.wayForPay.verifyServiceUrlSignature(payload)) {
      this.logger.warn(
        `Invalid WayForPay signature for order ${orderReference}, ignoring`,
      );
      throw new BadRequestException("Invalid WayForPay signature");
    }

    const status = payload.transactionStatus;
    const eventKey = `${orderReference}:${status ?? "unknown"}:${payload.reasonCode ?? ""}`;

    try {
      await this.prisma.paymentWebhookEvent.create({
        data: { provider: "wayforpay", eventKey },
      });
    } catch (err) {
      if ((err as { code?: string })?.code === "P2002") {
        this.logger.debug(`WayForPay event ${eventKey} already processed`);
        return this.wayForPay.buildAcceptResponse(orderReference);
      }
      throw err;
    }

    if (this.wayForPay.isApproved(status)) {
      await this.fulfillment.markPaid({
        orderReference,
        amount: payload.amount != null ? Number(payload.amount) : undefined,
        currency: payload.currency,
      });
    } else if (this.wayForPay.isPendingStatus(status)) {
      this.logger.log(`Order ${orderReference} still in progress: ${status}`);
    } else if (status === WAYFORPAY_STATUS.refunded) {
      this.logger.log(`Order ${orderReference} refunded, access left untouched`);
    } else {
      await this.fulfillment.markFailed(orderReference, payload.reason);
    }

    return this.wayForPay.buildAcceptResponse(orderReference);
  }
}
