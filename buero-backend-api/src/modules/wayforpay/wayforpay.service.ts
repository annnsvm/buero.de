import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHmac, randomUUID } from "crypto";
import {
  WAYFORPAY_STATUS,
  type WayForPayAcceptResponse,
  type WayForPayCheckStatusResponse,
  type WayForPayPurchaseParams,
  type WayForPayServiceUrlPayload,
} from "./wayforpay.types";

/** Створення платіжної сторінки без редіректу форми (повертає JSON з url). */
const PAY_OFFLINE_URL = "https://secure.wayforpay.com/pay?behavior=offline";
/** API для CHECK_STATUS / REFUND. */
const API_URL = "https://api.wayforpay.com/api";

@Injectable()
export class WayForPayService {
  private readonly logger = new Logger(WayForPayService.name);

  constructor(private readonly configService: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(
      this.configService.get<string>("WAYFORPAY_MERCHANT_ACCOUNT") &&
        this.configService.get<string>("WAYFORPAY_MERCHANT_SECRET"),
    );
  }

  getDefaultCurrency(): string {
    return (
      this.configService.get<string>("WAYFORPAY_CURRENCY") ?? "EUR"
    ).toUpperCase();
  }

  getServiceUrl(): string {
    const url = this.configService.get<string>("WAYFORPAY_SERVICE_URL");
    if (!url) {
      throw new BadRequestException(
        "WayForPay не налаштовано: відсутній WAYFORPAY_SERVICE_URL",
      );
    }
    return url;
  }

  /**
   * Куди WayForPay повертає браузер клієнта. Це POST, тому URL веде на бекенд,
   * який уже редіректить на сторінку фронтенду.
   */
  getReturnUrl(): string {
    return (
      this.configService.get<string>("WAYFORPAY_RETURN_URL") ??
      `${this.getServiceUrl()}/return`
    );
  }

  /** Унікальний orderReference для нового замовлення. */
  generateOrderReference(): string {
    return `bd-${Date.now()}-${randomUUID().slice(0, 8)}`;
  }

  /**
   * WayForPay порівнює підпис із рядковими значеннями, які реально надійшли.
   * Формат як у документації: 1000, 547.36 (без зайвих нулів).
   */
  formatAmount(value: number): string {
    return String(Number(value.toFixed(2)));
  }

  private getMerchantAccount(): string {
    const account = this.configService.get<string>(
      "WAYFORPAY_MERCHANT_ACCOUNT",
    );
    if (!account) {
      throw new BadRequestException(
        "WayForPay не налаштовано: відсутній WAYFORPAY_MERCHANT_ACCOUNT",
      );
    }
    return account;
  }

  private getMerchantSecret(): string {
    const secret = this.configService.get<string>("WAYFORPAY_MERCHANT_SECRET");
    if (!secret) {
      throw new BadRequestException(
        "WayForPay не налаштовано: відсутній WAYFORPAY_MERCHANT_SECRET",
      );
    }
    return secret;
  }

  private getMerchantDomain(): string {
    return (
      this.configService.get<string>("WAYFORPAY_MERCHANT_DOMAIN") ?? "localhost"
    );
  }

  private sign(line: string): string {
    return createHmac("md5", this.getMerchantSecret())
      .update(line, "utf8")
      .digest("hex");
  }

  /** HMAC_MD5 підпис запиту Purchase. */
  buildPurchaseSignature(params: {
    merchantAccount: string;
    merchantDomainName: string;
    orderReference: string;
    orderDate: number;
    amount: string;
    currency: string;
    productNames: string[];
    productCounts: number[];
    productPrices: string[];
  }): string {
    return this.sign(
      [
        params.merchantAccount,
        params.merchantDomainName,
        params.orderReference,
        String(params.orderDate),
        params.amount,
        params.currency,
        ...params.productNames,
        ...params.productCounts.map(String),
        ...params.productPrices,
      ].join(";"),
    );
  }

  /** Перевірка підпису callback-запиту на serviceUrl. */
  verifyServiceUrlSignature(payload: WayForPayServiceUrlPayload): boolean {
    const received = payload.merchantSignature;
    if (typeof received !== "string" || received.length === 0) return false;

    const expected = this.sign(
      [
        payload.merchantAccount ?? "",
        payload.orderReference ?? "",
        String(payload.amount ?? ""),
        payload.currency ?? "",
        payload.authCode ?? "",
        payload.cardPan ?? "",
        payload.transactionStatus ?? "",
        String(payload.reasonCode ?? ""),
      ].join(";"),
    );

    return expected === received;
  }

  /** Підписана відповідь, без якої WayForPay повторює callback до 4 діб. */
  buildAcceptResponse(orderReference: string): WayForPayAcceptResponse {
    const time = Math.floor(Date.now() / 1000);
    return {
      orderReference,
      status: "accept",
      time,
      signature: this.sign([orderReference, "accept", String(time)].join(";")),
    };
  }

  isApproved(status?: string): boolean {
    return status === WAYFORPAY_STATUS.approved;
  }

  /** true для статусів, які ще можуть змінитися на Approved. */
  isPendingStatus(status?: string): boolean {
    return (
      status === WAYFORPAY_STATUS.inProcessing ||
      status === WAYFORPAY_STATUS.pending ||
      status === WAYFORPAY_STATUS.waitingAuthComplete
    );
  }

  /** Створює платіжну сторінку та повертає URL для редіректу клієнта. */
  async createPaymentPageUrl(params: WayForPayPurchaseParams): Promise<string> {
    const merchantAccount = this.getMerchantAccount();
    const merchantDomainName = this.getMerchantDomain();
    const productCount = params.productCount ?? 1;
    const amount = this.formatAmount(params.amount);
    const productPrice = this.formatAmount(params.productPrice);

    const merchantSignature = this.buildPurchaseSignature({
      merchantAccount,
      merchantDomainName,
      orderReference: params.orderReference,
      orderDate: params.orderDate,
      amount,
      currency: params.currency,
      productNames: [params.productName],
      productCounts: [productCount],
      productPrices: [productPrice],
    });

    const body = new URLSearchParams();
    body.set("merchantAccount", merchantAccount);
    body.set("merchantAuthType", "SimpleSignature");
    body.set("merchantDomainName", merchantDomainName);
    body.set("merchantTransactionSecureType", "AUTO");
    body.set("merchantSignature", merchantSignature);
    body.set("apiVersion", "1");
    body.set("orderReference", params.orderReference);
    body.set("orderDate", String(params.orderDate));
    body.set("amount", amount);
    body.set("currency", params.currency);
    body.append("productName[]", params.productName);
    body.append("productPrice[]", productPrice);
    body.append("productCount[]", String(productCount));
    body.set("returnUrl", params.returnUrl);
    body.set("serviceUrl", params.serviceUrl);
    if (params.clientEmail) body.set("clientEmail", params.clientEmail);
    if (params.clientAccountId) {
      body.set("clientAccountId", params.clientAccountId);
    }
    body.set("language", params.language ?? "EN");

    let raw: string;
    try {
      const response = await fetch(PAY_OFFLINE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: body.toString(),
      });
      raw = await response.text();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`WayForPay purchase request failed: ${message}`);
      throw new InternalServerErrorException(
        "Не вдалося звʼязатися з платіжним сервісом",
      );
    }

    let parsed: { url?: string; reason?: string; reasonCode?: number };
    try {
      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      this.logger.error(`WayForPay returned non-JSON response: ${raw}`);
      throw new InternalServerErrorException(
        "Платіжний сервіс повернув некоректну відповідь",
      );
    }

    if (!parsed.url) {
      this.logger.error(
        `WayForPay did not return payment url: ${raw} (order ${params.orderReference})`,
      );
      throw new BadRequestException(
        parsed.reason ?? "Платіжний сервіс не повернув посилання на оплату",
      );
    }

    return parsed.url;
  }

  /** CHECK_STATUS — джерело правди, коли callback ще не дійшов. */
  async checkStatus(
    orderReference: string,
  ): Promise<WayForPayCheckStatusResponse> {
    const merchantAccount = this.getMerchantAccount();
    const payload = {
      transactionType: "CHECK_STATUS",
      merchantAccount,
      orderReference,
      apiVersion: 1,
      merchantSignature: this.sign([merchantAccount, orderReference].join(";")),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return (await response.json()) as WayForPayCheckStatusResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`WayForPay checkStatus failed: ${message}`);
      throw new InternalServerErrorException(
        "Не вдалося перевірити статус платежу",
      );
    }
  }
}
