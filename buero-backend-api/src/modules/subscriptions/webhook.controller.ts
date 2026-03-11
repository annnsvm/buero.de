import { BadRequestException, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { WebhookService } from "./webhook.service";

@Controller("webhooks")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("stripe")
  async handleStripe(@Req() req: Request): Promise<{ received: boolean }> {
    const rawBody = (req as any).rawBody as Buffer | undefined;
    const signature = req.headers["stripe-signature"] as string | undefined;

    if (!rawBody || !signature) {
      throw new BadRequestException("Missing raw body or Stripe-Signature header");
    }

    await this.webhookService.handleStripeWebhook(rawBody, signature);
    return { received: true };
  }
}
